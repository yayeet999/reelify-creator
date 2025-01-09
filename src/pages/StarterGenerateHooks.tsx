import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Smile, BookOpen, Brain, Lightbulb, MessageSquare } from "lucide-react";

const StarterGenerateHooks = () => {
  const [selectedTone, setSelectedTone] = useState<string>("casual");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");
  const [inputText, setInputText] = useState("");

  const toneOptions = [
    { value: "casual", label: "Casual", icon: <Smile className="w-5 h-5" /> },
    { value: "professional", label: "Professional", icon: <BookOpen className="w-5 h-5" /> },
    { value: "educational", label: "Educational", icon: <Brain className="w-5 h-5" /> },
    { value: "funny", label: "Funny", icon: <Lightbulb className="w-5 h-5" /> },
    { value: "serious", label: "Serious", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl mb-6">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Generate Hooks
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Create engaging hooks for your short-form videos
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Input Section */}
            <div className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What's your video about?
                </label>
                <Textarea
                  placeholder="Describe your product, service, or topic..."
                  className="min-h-[150px] resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {/* Tone Selection Cards */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Tone</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {toneOptions.map((tone) => (
                    <Card
                      key={tone.value}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedTone === tone.value
                          ? "bg-primary text-white"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedTone(tone.value)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`${selectedTone === tone.value ? "text-white" : "text-primary"}`}>
                          {tone.icon}
                        </span>
                        <p className="font-medium">{tone.label}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Language Selection Cards */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Language</label>
                <div className="flex gap-4">
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      selectedLanguage === "english"
                        ? "bg-primary text-white"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedLanguage("english")}
                  >
                    <p className="font-medium">English</p>
                  </Card>
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      selectedLanguage === "spanish"
                        ? "bg-primary text-white"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedLanguage("spanish")}
                  >
                    <p className="font-medium">Spanish</p>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Column - Output Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <div className="p-4 space-y-4">
                  <p className="text-muted-foreground text-center">
                    Your generated hooks will appear here...
                  </p>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarterGenerateHooks;