import MetallicPaint from "./MetallicPaint";
import StarMask from "./StarMask";
import Text from "./Text";

const Experience = () => {
  return (
    <div className="flex flex-col md:flex-row md:gap-20  relative">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <StarMask />
      </div>
      <div className="flex-1/3 flex flex-col items-center justify-center ">
        <h1 className="text-5xl -mb-20 text-shadow-lg text-shadow-white">
          MindSyncX Labs
        </h1>
        <MetallicPaint
          imageSrc={"/Svgs/exp.svg"}
          // Pattern
          seed={42}
          scale={2}
          patternSharpness={1}
          noiseScale={0.2}
          // Animation
          speed={0.35}
          liquid={1}
          mouseAnimation={false}
          // Visual
          brightness={2}
          contrast={0.5}
          refraction={0.01}
          blur={0.015}
          chromaticSpread={1}
          fresnel={1}
          angle={0}
          waveAmplitude={1}
          distortion={1}
          contour={0.2}
          // Colors
          lightColor="#ffffff"
          darkColor="#000000"
          tintColor="#feb3ff"
        />
      </div>
      <div className="flex-2/3">
        <h1 className="text-5xl px-2 my-6 text-shadow-lg text-shadow-white">
          Full Stack Intern
        </h1>
        <p
          className="text-sm text-neutral-300 pl-6
  tracking-[2px] leading-8"
        >
          Developed and maintained responsive UI components, ensuring seamless
          user experience across devices <br /> Built and integrated front-end
          interfaces with backend services for full-stack functionality <br />
          Debugged and resolved build errors, improving application stability
          and performance <br /> Collaborated with team members to design,
          develop, and optimize scalable web features <br /> Implemented
          reusable components to enhance development efficiency and code
          maintainability <br /> Assisted in end-to-end feature development,
          from design to deployment
        </p>
      </div>
    </div>
  );
};

export default Experience;
