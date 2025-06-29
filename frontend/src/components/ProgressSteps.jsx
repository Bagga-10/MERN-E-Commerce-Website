const ProgressSteps = ({ step1, step2, step3 }) => {
  const steps = [
    { label: "Login", active: step1 },
    { label: "Shipping", active: step2 },
    { label: "Summary", active: step3 },
  ];

  return (
    <div className="flex items-center justify-center space-x-4 mt-[7rem]">
      {steps.map((step, index) => (
        <div className="flex items-center" key={index}>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step.active ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-gray-400"
            }`}
          >
            {step.active ? "✓" : index + 1}
          </div>

          <div className="ml-2 text-sm font-medium text-center">
            <div
              className={`${
                step.active ? "text-green-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className="w-10 h-0.5 bg-gray-300 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
