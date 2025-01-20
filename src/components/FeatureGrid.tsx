import { Check } from "lucide-react";

export const FeatureGrid = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12 bg-white">
      {/* Column 1: Bullet Points */}
      <div className="flex flex-col justify-between h-full py-4">
        <ul className="space-y-6">
          {["Green Screen Templates", "Custom Voiceover", "Easy to customize"].map((text, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
              <span className="text-base font-medium text-gray-600">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: Video */}
      <div className="aspect-[9/16] relative max-w-[120px] sm:max-w-none ml-auto">
        <video 
          className="w-full h-full object-cover rounded-lg"
          src="https://res.cloudinary.com/fornotreel/video/upload/v1737326888/exampleurl_aazlaz.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Column 3: Bullet Points */}
      <div className="flex flex-col justify-between h-full py-4">
        <ul className="space-y-6">
          {["Realistic UGC creators", "AI generate hooks", "Include your video, download instantly"].map((text, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
              <span className="text-base font-medium text-gray-600">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 4: Video */}
      <div className="aspect-[9/16] relative max-w-[120px] sm:max-w-none ml-auto">
        <video 
          className="w-full h-full object-cover rounded-lg"
          src="https://res.cloudinary.com/fornotreel/video/upload/v1737328775/exampleurl2_lrqetb.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Column 5: Bullet Points */}
      <div className="flex flex-col justify-between h-full py-4">
        <ul className="space-y-6">
          {["Huge variety for your personal style", "High quality REALISTIC creators", "Best marketing ROI"].map((text, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
              <span className="text-base font-medium text-gray-600">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 6: Video */}
      <div className="aspect-[9/16] relative max-w-[120px] sm:max-w-none ml-auto">
        <video 
          className="w-full h-full object-cover rounded-lg"
          src="https://res.cloudinary.com/fornotreel/video/upload/v1737330047/exampleurl3_thvruc.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};