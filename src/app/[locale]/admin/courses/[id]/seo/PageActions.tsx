import useStickyAdminActions from "@/app/hooks/useStickyAdminActions";
import { SaveActionState } from "@/app/types/actions";
import { Button } from "@/components/ui/button";
import { Loader, Save, CircleXIcon, Send } from "lucide-react";
import React from "react";

interface PageActionsProps {
  isPublsihed: boolean;
  handleSubmit: () => Promise<void>;
  actionState: SaveActionState;
  setActionState: React.Dispatch<React.SetStateAction<SaveActionState>>;
}

const PageActions = ({
  handleSubmit,
  setActionState,
  actionState,
  isPublsihed,
}: PageActionsProps) => {
  const { actionButtonsRef, isSticky, placeholderRef } =
    useStickyAdminActions();

  return (
    <div ref={placeholderRef} className="h-16 lg:h-20 flex">
      <div
        ref={actionButtonsRef}
        className={`w-full py-2 lg:py-4 px-2 lg:px-0 z-10 ${
          isSticky
            ? "bg-white  lg:bg-transparent fixed lg:relative top-[4rem] lg:top-0 left-0 right-0 shadow-md lg:shadow-none  md:px-12"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-row justify-end gap-2 px-4 lg:px-0 z-10  lg:gap-4">
            <div className="flex justify-start lg:justify-end gap-2 lg:gap-4">
              <Button
                variant="outline"
                className="flex h-8 lg:h-10 items-center gap-2"
                onClick={() => {
                  setActionState("saving");
                  handleSubmit();
                }}
                disabled={actionState !== "idle"}
              >
                {actionState === "saving" ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </div>
            <div className="flex justify-start lg:justify-end gap-2 lg:gap-4">
              {isPublsihed ? (
                <Button
                  className="flex h-8 lg:h-10 items-center gap-2 text-white"
                  onClick={() => {
                    setActionState("unpublishing");
                  }}
                  disabled={actionState !== "idle"}
                >
                  {actionState === "unpublishing" ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Unpublishing...</span>
                    </>
                  ) : (
                    <>
                      <CircleXIcon size={18} />
                      <span>Unpublish</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  className="flex items-center h-8 lg:h-10 gap-2 bg-primary text-white hover:bg-primary/90"
                  onClick={() => {
                    setActionState("publishing");
                  }}
                  disabled={actionState !== "idle"}
                >
                  {actionState === "publishing" ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Publish</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageActions;
