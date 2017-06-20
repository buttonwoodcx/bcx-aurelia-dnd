> If your computer screen is big enough to show both "simple-move-step-2" and "simple-move" demo apps within same frame, you can actually drag box from one app to the other, and generate cross-talk. To avoid cross-talk in your app, design `dndModel()` and `dndCanDrop()` defensively for target to only respond to its interested source model.

Next, let's see how to [customize preview and respond to dndHover](#/customize-preview-and-hover).
