import { useState } from "react";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Voice {
  id: string;
  name: string;
}

const AVAILABLE_VOICES: Voice[] = [
  { id: "RdQZQavFUKlavTXr5v3q", name: "Custom Voice" },
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie" },
];

interface VoiceSelectorProps {
  onAudioGenerated: (url: string) => void;
}

export const VoiceSelector = ({ onAudioGenerated }: VoiceSelectorProps) => {
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedVoice || !text.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a voice and enter some text",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    // TODO: Will implement the actual generation in the next step
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Voice</label>
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a voice" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_VOICES.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Enter Text</label>
        <Textarea
          placeholder="Enter the text you want to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={isGenerating || !selectedVoice || !text.trim()}
      >
        <Mic className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate Voice"}
      </Button>
    </div>
  );
};