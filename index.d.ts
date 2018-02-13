interface SourceDelegate {
  dndElement?: Element;
  dndModel(): any;
  dndPreview?(model: any): Element;
}

interface SourceOptions {
  element?: Element;
  handler?: Element;
  noPreview?: boolean;
  hideCursor?: boolean;
  centerPreviewToMousePosition?: boolean;
}

interface Point {
  readonly x: number;
  readonly y: number;
}

interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface DndLocation {
  mouseStartAt: Point;
  mouseEndAt: Point;
  sourceElementRect: Rect;
  previewElementRect: Rect;
  targetElementRect: Rect;
}

declare interface TargetDelegateInjectedDnd {
  readonly isProcessing: boolean;
  readonly model?: any;
  readonly canDrop?: boolean;
  readonly isHovering?: boolean;
  readonly isHoveringShallowly?: boolean;
}

interface TargetDelegate {
  dndElement?: Element;
  dndCanDrop(model: any): boolean;
  dndDrop(location: DndLocation): void;
  dndHover?(location: DndLocation): void;
  dnd?: TargetDelegateInjectedDnd;
}

interface TargetOptions {
  element?: Element;
}

type PreviewDrawer = (Element) => Element?;

export declare class DndService {
  readonly isProcessing: boolean;
  readonly model: any;

  addSource(sourceDelegate: SourceDelegate, options?: SourceOptions): void;
  removeSource(source: SourceDelegate | Element): void;

  addTarget(targetDelegate: TargetDelegate, options?: TargetOptions): void;
  removeTarget(target: TargetDelegate | Element): void;

  addPreviewDrawer(drawer: PreviewDrawer): void;
}
