"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  BookOpen,
  AlignLeft,
  Save,
  ArrowRight,
  Tag,
  Send,
} from "lucide-react";

const InfoPage = () => {
  const [unassignedCategories, setUnassignedCategories] = useState([
    { id: 1, name: "Web Development" },
    { id: 2, name: "UI/UX Design" },
    { id: 3, name: "Digital Marketing" },
    { id: 4, name: "Business" },
    { id: 5, name: "Programming" },
    { id: 6, name: "Data Science" },
    { id: 7, name: "Mobile Development" },
  ]);

  const [assignedCategories, setAssignedCategories] = useState([]);
  const [thumbnailSrc, setThumbnailSrc] = useState("/placeholder.svg");
  const fileInputRef = useRef(null);

  const moveToAssigned = (categoryId) => {
    const category = unassignedCategories.find((c) => c.id === categoryId);
    setUnassignedCategories(
      unassignedCategories.filter((c) => c.id !== categoryId)
    );
    setAssignedCategories([...assignedCategories, category]);
  };

  const moveToUnassigned = (categoryId) => {
    const category = assignedCategories.find((c) => c.id === categoryId);
    setAssignedCategories(
      assignedCategories.filter((c) => c.id !== categoryId)
    );
    setUnassignedCategories([...unassignedCategories, category]);
  };

  const moveAllToAssigned = () => {
    setAssignedCategories([...assignedCategories, ...unassignedCategories]);
    setUnassignedCategories([]);
  };

  const moveAllToUnassigned = () => {
    setUnassignedCategories([...unassignedCategories, ...assignedCategories]);
    setAssignedCategories([]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-end mb-8 gap-4">
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Save size={18} />
          <span>Save</span>
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Save size={18} />
          <ArrowRight size={18} />
          <span>Save & Continue</span>
        </Button>
        <Button
          size="lg"
          className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
        >
          <Send size={18} />
          <span>Publish</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="mb-8">
            <Label
              htmlFor="title"
              className="text-base font-semibold flex items-center gap-2 mb-2"
            >
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
                <BookOpen size={16} className="text-white" />
              </div>
              Course Title
            </Label>
            <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
              <Input
                id="title"
                placeholder="Enter course title"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 px-4 text-base bg-white"
              />
            </div>
          </div>

          <div className="mb-8">
            <Label
              htmlFor="shortDescription"
              className="text-base font-semibold flex items-center gap-2 mb-2"
            >
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
                <AlignLeft size={16} className="text-white" />
              </div>
              Short Description
            </Label>
            <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
              <Textarea
                id="shortDescription"
                placeholder="A brief overview of your course"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-24 p-4 text-base resize-none bg-white"
              />
            </div>
          </div>

          <div className="mb-8">
            <Label className="text-base font-semibold flex items-center gap-2 mb-2">
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
                <Tag size={16} className="text-white" />
              </div>
              Course Categories
            </Label>

            <div className="border-2 rounded-lg p-4 bg-white">
              <div className="flex gap-2 justify-center">
                {/* Unassigned Categories */}
                <div className="w-[45%]">
                  <div className="font-medium mb-2 text-sm text-center">
                    <span>Unassigned Categories</span>
                  </div>
                  <div className="border rounded-md h-48 overflow-y-auto">
                    {unassignedCategories.map((category) => (
                      <div
                        key={category.id}
                        className="p-2.5 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer flex justify-between items-center group"
                        onClick={() => moveToAssigned(category.id)}
                      >
                        <span className="text-sm">{category.name}</span>
                        <ChevronRight
                          size={16}
                          className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                    {unassignedCategories.length === 0 && (
                      <div className="p-3 text-gray-500 text-xs italic flex justify-center items-center h-full">
                        No categories available
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Buttons in Middle */}
                <div className="flex flex-col justify-center items-center gap-3 w-1/12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={moveAllToAssigned}
                    disabled={unassignedCategories.length === 0}
                    className="h-8 w-8 p-0"
                    title="Assign all categories"
                  >
                    <ChevronRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={moveAllToUnassigned}
                    disabled={assignedCategories.length === 0}
                    className="h-8 w-8 p-0"
                    title="Unassign all categories"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                </div>

                {/* Assigned Categories */}
                <div className="w-[45%]">
                  <div className="font-medium mb-2 text-sm text-center">
                    <span>Assigned Categories</span>
                  </div>
                  <div className="border rounded-md h-48 overflow-y-auto">
                    {assignedCategories.map((category) => (
                      <div
                        key={category.id}
                        className="p-2.5 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer flex justify-between items-center group"
                        onClick={() => moveToUnassigned(category.id)}
                      >
                        <ChevronLeft
                          size={16}
                          className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                    ))}
                    {assignedCategories.length === 0 && (
                      <div className="p-3 text-gray-500 text-xs italic flex justify-center items-center h-full">
                        No categories assigned
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-8">
            <Label
              htmlFor="fullDescription"
              className="text-base font-semibold flex items-center gap-2 mb-2"
            >
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
                <AlignLeft size={16} className="text-white" />
              </div>
              Full Description
            </Label>
            <div className="border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent transition-all bg-white">
              <Textarea
                id="fullDescription"
                placeholder="Provide a detailed description of your course content, learning outcomes, and target audience"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-60 p-4 text-base resize-none bg-white"
              />
            </div>
          </div>

          <div className="mb-8">
            <Label
              htmlFor="thumbnail"
              className="text-base font-semibold flex items-center gap-2 mb-2"
            >
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-secondary/20">
                <Upload size={16} className="text-white" />
              </div>
              Course Thumbnail
            </Label>
            <div className="border-2 rounded-lg overflow-hidden bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative aspect-square w-full">
                  <Image
                    src={thumbnailSrc}
                    alt="Course thumbnail"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">Thumbnail Image</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload a high-quality image that represents your course
                      content
                    </p>
                    <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                      <li>Recommended size: 1280x720px</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Formats: JPG, PNG, SVG</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={triggerFileInput}
                      className="text-xs flex-1"
                    >
                      Replace Image
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setThumbnailSrc("/placeholder.svg")}
                    >
                      Remove
                    </Button>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
