# Change Log

- **src/app/diagram/[uuid]/ClientDiagram.tsx**: removed the unused `TopNavigationBar` import that caused lint errors.
- **src/app/diagram/[uuid]/page.tsx**: aligned the `params` typing with Next.js expectations by treating it as a promise and awaiting it before use.
- **src/app/doc/[uuid]/page.tsx**: matched the document page route to the same promise-based `params` typing fix as the diagram route.
- **src/app/test/page.tsx**: trimmed unused file service imports so that only the invoked helpers remain.
- **src/components/diagram/DiagramRenderer.tsx**: dropped unused React hooks and Excalidraw imports to silence lint complaints.
- **src/components/layout/NotePage/FolderItem.tsx**: wrapped the GitHub icon with a `<span>` that carries the tooltip and hides the SVG from assistive tech.
- **src/components/layout/NotePage/InviteUserModal.tsx**: simplified icon imports and ensured the collaborator argument is referenced when logging unfinished removal logic.
- **src/components/layout/NotePage/NoteUI.tsx**: added the missing `NoteDTO` type import so the state hook type checks.
- **src/libs/structures/treenote.ts**: removed the unused `codeText` import leftover from earlier experiments.
- **src/types/file.d.ts**: replaced the empty `Segment` interface with a `SegmentDTO` alias to satisfy lint rules about empty object types.
