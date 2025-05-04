import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/app/types/course";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { EditDialog } from "./EditDialog";
import { categoryActions } from "@/app/actions/category";
import toast from "react-hot-toast";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
}

const CategorySkeleton = () => {
  return (
    <div className="divide-y">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  isLoading,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);
    try {
      await categoryActions.deleteCategory(selectedCategory.categoryId);
      toast.success("Category deleted successfully");
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border">
        {isLoading ? (
          <CategorySkeleton />
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found. Create your first category!
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category) => (
              <div
                key={category.categoryId}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {category.title}
                      </h3>
                      <Badge variant="secondary">
                        {category.language.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.title}"? This action cannot be undone.`}
        handleDeleted={handleDelete}
        confirmText="Delete"
        isLoading={isDeleting}
      />

      {selectedCategory && (
        <EditDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          category={selectedCategory}
        />
      )}
    </>
  );
};
