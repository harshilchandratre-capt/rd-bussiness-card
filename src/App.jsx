import "./App.css";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [modalImg, setModalImg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "businessCard", "siteContent");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData(snap.data());
      } else {
        console.error("No such document!");
      }
    };
    fetchData();
  }, []);

  if (!data) return <div className="text-white">Loading...</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const ref = doc(db, "businessCard", "siteContent");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const existingContacts = snap.data().contacts || [];

        const newContact = {
          id: Date.now().toString(),
          name: form.name,
          email: form.email,
          message: form.message,
          createdAt: new Date().toISOString(),
        };

        await updateDoc(ref, {
          contacts: [...existingContacts, newContact],
        });

        setShowModal(true);
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Error saving contact:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col bg-[#131700] min-h-screen">
        <section className="bg-black w-full sm:w-[80%] md:w-[60%] lg:w-[400px] p-4 flex flex-col items-center relative">
          {/* Banner */}
          <div className="w-full">
            <img
              src={data.profile?.banner}
              alt="cover"
              className="object-cover w-full h-52 rounded-md"
              loading="lazy"
            />
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center gap-2 -translate-y-6">
            <img
              src={data.profile?.pfp}
              alt="profile"
              onClick={() => setModalImg(data.profile?.pfp)}
              className="w-20 h-20 rounded-md object-cover border-2 border-[#e4c590] cursor-pointer hover:scale-105 transition"
            />
            <label className="mt-2 text-2xl text-[#e4c590] hover:text-[#efebe3]">
              {data.profile?.name}
            </label>
            <label className="text-[#dda66f]">{data.profile?.subtitle}</label>

            {/* Socials */}
            <div className="flex gap-3 mt-2">
              {data.socials?.map((s, i) => (
                <SocialIcon
                  key={i}
                  href={"#"}
                  icon={`ri-${s.icon}-fill`}
                  bg={s.bg}
                  shadow={s.shadow}
                />
              ))}
            </div>

            {/* Bio */}
            <p className="text-sm text-[#e4c590] px-4 mt-2 text-center">
              {data.profile?.bio}
            </p>
          </div>

          {/* Services */}
          <h2 className="w-full text-center text-lg font-semibold text-[#e4c590] mb-4">
            Services..
          </h2>
          <div className="w-full grid grid-cols-1 gap-5">
            {data.services?.map((srv, i) => (
              <ServiceCard
                key={i}
                icon={`ri-${srv.icon}-fill`}
                title={srv.title}
                desc={srv.desc}
              />
            ))}
          </div>

          {/* Gallery */}
          <div className="w-full mt-6">
            <h2 className="w-full text-center text-lg font-semibold text-[#e4c590] mb-3">
              Gallery
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {data.gallery?.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="gallery"
                  onClick={() => setModalImg(src)}
                  className="w-40 h-28 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="w-full mt-6">
            <h2 className="w-full text-center text-lg font-semibold text-[#e4c590] mb-3">
              Business Inquiry
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="p-2 rounded bg-[#1c1c1c] text-white focus:outline-[#e4c590]"
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="p-2 rounded bg-[#1c1c1c] text-white focus:outline-[#e4c590]"
                required
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="3"
                className="p-2 rounded bg-[#1c1c1c] text-white focus:outline-[#e4c590]"
                required
              />
              <button
                type="submit"
                className="bg-[#e4c590] text-black font-semibold py-2 rounded hover:opacity-90"
              >
                Send Inquiry
              </button>
            </form>
          </div>

          {/* Map Section */}
          {data.location?.coordinates && (
            <div className="w-full mt-6">
              <h2 className="w-full text-center text-lg font-semibold text-[#e4c590] mb-3">
                Find Us
              </h2>
              <div className="rounded-lg overflow-hidden shadow-md border border-[#333]">
                <iframe
                  title="map"
                  src={`https://www.google.com/maps?q=${data.location.coordinates.lat},${data.location.coordinates.lng}&hl=es;z=14&output=embed`}
                  width="100%"
                  height="250"
                  allowFullScreen=""
                  loading="lazy"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 text-center text-[#aaa] text-sm">
            <p>{data.location?.address}</p>
            <p>
              © {new Date().getFullYear()} {""}
              <span className="text-[#e4c590]">
                {data.profile?.name}
              </span>
              . All rights reserved.
            </p>
            <p>made with <i className="text-[#009deb] ri-heart-2-fill"></i> and 🍵 by <a href="https://github.com/harshilchandratre"><i class="ri-github-line">harshilchandratre</i></a></p>
          </footer>
        </section>
      </div>

      {/* Image Modal */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setModalImg(null)}
        >
          <img
            src={modalImg}
            alt="modal"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg transition-transform scale-100 hover:scale-105"
          />
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div
            className="
              bg-[#1c1c1c] p-6 rounded-lg shadow-lg max-w-sm text-center border border-[#e4c590]
              transform transition-all duration-300 ease-out opacity-0 scale-90 animate-fadeIn
            "
          >
            <h2 className="text-xl font-semibold text-[#e4c590] mb-3">
              Inquiry Sent!
            </h2>
            <p className="text-white mb-5">
              Thanks{" "}
              <span className="text-[#e4c590]">{form.name || "Friend"}</span>,
              we received your message and will get back to you soon.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-[#e4c590] text-black font-semibold px-4 py-2 rounded hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ServiceCard Component
function ServiceCard({ icon, title, desc }) {
  return (
    <div className="bg-[#1c1c1c] rounded-xl p-4 text-[#e4c590] flex items-center gap-4 shadow-md hover:scale-[1.02] transition">
      <div className="bg-[#e4c590] rounded-full w-12 h-12 flex items-center justify-center">
        <i className={`${icon} text-[#1e1e1e] text-xl`}></i>
      </div>
      <div>
        <h2 className="text-md font-semibold text-[#e4c590]">{title}</h2>
        <p className="text-xs mt-1 text-white">{desc}</p>
      </div>
    </div>
  );
}

// SocialIcon Component
function SocialIcon({ href, icon, bg, shadow }) {
  return (
    <a
      href={href}
      className={`${bg} bg-opacity-80 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:scale-[1.25] ${shadow} transition`}
    >
      <i className={`${icon} text-white`}></i>
    </a>
  );
}

export default App;
