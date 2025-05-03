import React from "react";
import { useNavigate } from "react-router-dom";

function Cards() {
  const navigate = useNavigate();

  const categories = [
    { title: "General Knowledge", image: "https://img.freepik.com/free-vector/knowledge-background-design_1300-109.jpg" },
    { title: "History", image: "https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/900x600/10598/19-SM305143.jpg" },
    { title: "Science: Gadgets", image: "https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/900x600/20483/300-PA1069163.jpg" },
    { title: "Movies", image: "https://png.pngtree.com/element_our/png/20181113/clapperboard-film-logo-icon-design-template-vector-isolated-png_236642.jpg" },
    { title: "Sports", image: "https://img.pikbest.com/png-images/20241031/minimalist-sports-logo-vector-illustration-on-transparent-background_11037606.png!sw800" },
    { title: "Science & Nature", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tD7Ubsm4YcAtsNbSx8puoQ9oA7lk9eO2YA&s" },
  ];

  const handleStartQuiz = (category) => {
    navigate("/quiz", { state: { category } });
  };

  return (
    <div className="flex flex-wrap justify-center gap-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {categories.map((category, index) => (
        <div
          key={category.title}
          className="w-56 bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden transform transition duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <div className="bg-white dark:bg-gray-800 p-[2px] rounded-t-xl">
            <img
              src={category.image}
              alt={category.title}
              className="h-44 w-full object-cover rounded-t-xl dark:brightness-75"
            />
          </div>
          <div className="p-4 flex flex-col items-center w-full bg-white dark:bg-gray-700">
            <p className="font-semibold text-lg text-center mb-2 text-black dark:text-white">
              {category.title}
            </p>
            <button
              className="w-full bg-orange-500 hover:bg-orange-600 transition rounded-lg py-2 font-semibold text-white"
              onClick={() => handleStartQuiz(category.title)}
            >
              Start Quiz
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cards;
