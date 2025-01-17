import { useState } from "react";
import { Mic, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const { toast } = useToast();

  const handlePreview = async () => {
    if (!selectedVoice) {
      toast({
        title: "Select a Voice",
        description: "Please select a voice before previewing",
        variant: "destructive",
      });
      return;
    }

    setIsPreviewPlaying(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-voice', {
        body: {
          voiceId: selectedVoice,
          text: "Hey, this is a voice preview of my voice",
        },
      });

      if (error) throw error;

      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        await audio.play();
        toast({
          title: "Preview Playing",
          description: "Playing voice preview...",
        });
      } else {
        throw new Error('No audio URL received');
      }
    } catch (error) {
      console.error('Error playing preview:', error);
      toast({
        title: "Error",
        description: "Failed to play voice preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPreviewPlaying(false);
    }
  };

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
    try {
      const { data, error } = await supabase.functions.invoke('generate-voice', {
        body: {
          voiceId: selectedVoice,
          text: text.trim(),
        },
      });

      if (error) throw error;

      if (data?.audioUrl) {
        onAudioGenerated(data.audioUrl);
        toast({
          title: "Success",
          description: "Voice generated successfully!",
        });
      } else {
        throw new Error('No audio URL received');
      }
    } catch (error) {
      console.error('Error generating voice:', error);
      toast({
        title: "Error",
        description: "Failed to generate voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Voice</label>
        <div className="flex items-center gap-2">
          <Select 
            value={selectedVoice} 
            onValueChange={setSelectedVoice}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose a voice" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_VOICES.map((voice) => (
                <SelectItem 
                  key={voice.id} 
                  value={voice.id}
                >
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreview}
            disabled={isPreviewPlaying || !selectedVoice}
          >
            <Play className={`h-4 w-4 ${isPreviewPlaying ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
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