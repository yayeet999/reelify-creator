import { Check } from "lucide-react";

export const FeatureGrid = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
      {/* Column 1: Bullet Points */}
      <div className="space-y-4">
        <ul className="space-y-3">
          {["Quick setup process", "Easy to customize", "Instant results"].map((text, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-gray-600">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: Video */}
      <div className="aspect-[9/16] relative">
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
      <div className="space-y-4">
        <ul className="space-y-3">
          {["Powerful AI features", "Smart automation", "Real-time preview"].map((text, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-gray-600">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 4: Video */}
      <div className="aspect-[9/16] relative">
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
      <div className="space-y-4">
        <ul className="space-y-3">
          {["Export in seconds", "Multiple formats", "Cloud storage"].map((text, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-gray-600">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 6: Video */}
      <div className="aspect-[9/16] relative">
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