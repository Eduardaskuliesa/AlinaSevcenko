export type SaveActionState =
  | "idle"
  | "saving"
  | "saving-and-continuing"
  | "publishing"
  | "adding-lesson"
  | "unpublishing"
  | "save-and-publish";
