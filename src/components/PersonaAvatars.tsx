import React from "react";
import linhImg from "../assets/cskh_linh.png";
import huongImg from "../assets/hr_huong.png";
import minhImg from "../assets/tech_minh.png";

export function SweetLinhAvatar() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-md border border-pink-500/10 group-hover:border-pink-500/30 transition-all duration-500">
      <img
        src={linhImg}
        alt="Chị Linh"
        className="w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  );
}

export function ToughHuongAvatar() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-md border border-slate-500/10 group-hover:border-slate-500/30 transition-all duration-500">
      <img
        src={huongImg}
        alt="Bà Hương"
        className="w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  );
}

export function MentorMinhAvatar() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-md border border-blue-500/10 group-hover:border-blue-500/30 transition-all duration-500">
      <img
        src={minhImg}
        alt="Anh Minh"
        className="w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  );
}
