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
  dnd?: TargetDelegateInjectedDnd;
  dndCanDrop(model: any): boolean;
  dndDrop(location: DndLocation): void;
  dndHover?(location: DndLocation): void;
}

interface TargetOptions {
  element?: Element;
}

type PreviewDrawer = (element: Element) => Element | void;

export declare class DndService {
  public readonly isProcessing: boolean;
  public readonly model: any;

  public addSource(sourceDelegate: SourceDelegate, options?: SourceOptions): void;
  public removeSource(source: SourceDelegate | Element): void;

  public addTarget(targetDelegate: TargetDelegate, options?: TargetOptions): void;
  public removeTarget(target: TargetDelegate | Element): void;

  public addPreviewDrawer(drawer: PreviewDrawer): void;
}
