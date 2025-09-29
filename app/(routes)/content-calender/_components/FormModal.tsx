import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ageGroups,
  contentTypes,
  locations,
  postingFrequency,
  goals,
} from "./options";
import React, { useState } from "react";

interface CalanderForm {
  OnSubmit?: (values: {
    ContentType: string;
    AgeGroup: string;
    Location: string;
    Goals: string;
    PostingFrequency: string;
  }) => void;
}

export const FormModal: React.FC<CalanderForm> = ({ OnSubmit }) => {
  const [values, setValues] = useState({
    ContentType: "",
    AgeGroup: "",
    Location: "",
    Goals: "",
    PostingFrequency: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if (OnSubmit) {
      OnSubmit(values);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Get Started</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fill the details</DialogTitle>
            <DialogDescription>
              Fill this to generate content calendar
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Content Type */}
            <div className="grid gap-3">
              <Label>Content Type</Label>
              <Select
                value={values.ContentType}
                onValueChange={(val) => {
                  setValues((prev) => ({ ...prev, ContentType: val }));
                  console.log(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Age Group */}
            <div className="grid gap-3">
              <Label>Age Group</Label>
              <Select
                value={values.AgeGroup}
                onValueChange={(val) =>
                  setValues((prev) => ({ ...prev, AgeGroup: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Age Group" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="grid gap-3">
              <Label>Location</Label>
              <Select
                value={values.Location}
                onValueChange={(val) =>
                  setValues((prev) => ({ ...prev, Location: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Goals */}
            <div className="grid gap-3">
              <Label>Goals</Label>
              <Select
                value={values.Goals}
                onValueChange={(val) =>
                  setValues((prev) => ({ ...prev, Goals: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Posting Frequency */}
            <div className="grid gap-3">
              <Label>Posting Frequency</Label>
              <Select
                value={values.PostingFrequency}
                onValueChange={(val) =>
                  setValues((prev) => ({ ...prev, PostingFrequency: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your posting frequency" />
                </SelectTrigger>
                <SelectContent>
                  {postingFrequency.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Generate Calendar</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
