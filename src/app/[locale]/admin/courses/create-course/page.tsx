import CreateCourseForm from "./CreateCourseForm";

export const dynamic = "force-static";

export default function CreateCourseServerPage() {
  return (
    <div className="px-2 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <CreateCourseForm />
    </div>
  );
}
