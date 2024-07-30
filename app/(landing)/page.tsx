"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { Voicemail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, formSchemaGenerateSpeech, voiceOptions } from "./constants";

import Heading from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/loader";
import { Label } from "@/components/ui/label";

const AISpeaker = () => {
  const router = useRouter();
  const [audio, setAudio] = useState("");
  const [intro, setIntro] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      language: "",
    },
  });

  const formGenerateSpeech = useForm<z.infer<typeof formSchemaGenerateSpeech>>({
    resolver: zodResolver(formSchemaGenerateSpeech),
    defaultValues: {
      prompt: "",
      voice: "alloy",
    },
  });

  const playAudio = () => {
    const newaudio = new Audio(`data:audio/mp3;base64,${audio}`);
    newaudio.play();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setAudio("");
      const intro = await axios.post("/api/prepareIntro", {
        prompt: values.prompt,
        language: values.language,
      });
      setIntro(intro.data.content);
      
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const isLoad = formGenerateSpeech.formState.isSubmitting;
  const generateSpeech = async (values: z.infer<typeof formSchemaGenerateSpeech>) => {
    try {
      setAudio("");
      values.prompt = intro
      console.log(values)
      const response = await axios.post("/api/textToSpeech", {
        prompt: intro,
        voice: values.voice,
      });
      console.log(response);
      setAudio(response.data);
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="mt-8">
      <Heading
        title="AI Speaker"
        description="Your Stage Companion"
        icon={Voicemail}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Prepare Intro</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
                items-center
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-12">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="w-full border-2 p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Paste the text here…"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Label className="col-span-12 lg:col-span-1">Language:</Label>
              <FormField
                name="language"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="w-full border-2 p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Which Language?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-12 w-full bg-green-700 hover:bg-green-900"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Prepare Intro
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {intro.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Generate Speech</h2>
              <Form {...formGenerateSpeech}>
                <form
                  onSubmit={formGenerateSpeech.handleSubmit(generateSpeech)}
                  className="
                  rounded-lg 
                  border 
                  w-full 
                  p-4 
                  px-3 
                  md:px-6 
                  focus-within:shadow-sm
                  grid
                  grid-cols-12
                  gap-2
                "
                >
                  <FormField
                    name="prompt"
                    render={() => (
                      <FormItem className="col-span-12 lg:col-span-12">
                        <FormControl className="m-0 p-0">
                          <Textarea
                            className="w-full border-2 p-2 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                            disabled={isLoading}
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formGenerateSpeech.control}
                    name="voice"
                    render={({ field }) => (
                      <FormItem className="col-span-12 lg:col-span-6">
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue defaultValue={field.value} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {voiceOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button
                    className="col-span-12 lg:col-span-12 w-full bg-green-700 hover:bg-green-900"
                    type="submit"
                    disabled={isLoad}
                    size="icon"
                  >
                    Generate Speech
                  </Button>
                </form>
              </Form>
            </div>
          )}
          {isLoading  && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {isLoad  && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {audio.length === 0 && !isLoading && (
            <h1 className="text-sm font-light text-red-500">
              No Speech Generated Yet!
            </h1>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {audio.length > 0 ? (
              <div className="w-full">
                <audio controls>
                  <source
                    src={`data:audio/mp3;base64,${audio}`}
                    type="audio/mp3"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISpeaker;
