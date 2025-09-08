import React from "react";

const features = [
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1024px-Eo_circle_green_checkmark.svg.png",
    title: "Smart Difficulty",
    desc: "Auto-adjusted level",
  },
  {
    img: "https://png.pngtree.com/png-vector/20230315/ourmid/pngtree-globe-line-icon-vector-png-image_6650542.png",
    title: "Topic Variety",
    desc: "Tech, Science, & much more",
  },
  {
    img: "https://pngfile.net/public/uploads/preview/golden-award-cup-vector-png-117244189155j7s6qxu1d.png",
    title: "LeaderBoard",
    desc: "Compete Globally",
  },
];

export default function FeatureIcons() {
  return (
    <div
      className="mx-auto max-w-6xl mt-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-wrap justify-around items-center gap-6 text-black dark:text-white"
      data-aos="zoom-in-up"
    >
      {features.map((f, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center text-center w-64"
        >
          <img
            src={f.img}
            alt={`${f.title} Icon`}
            className="h-16 w-16 object-contain mb-2 dark:bg-gray-700 p-1 rounded-full"
          />
          <p className="font-semibold text-lg mb-1">{f.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
