# Customize preview and respond to dndHover

## Turn off preview

The first thing you can do is to turn off preview. Simply pass option `{noPreview: true}` to `this.dndService.addSource(this, {noPreview: true})`.

## Use dndHover for real-time feedback

Preview has its limitation, it is a static snapshot of source element at the time of starting DnD session. That means the preview would never change.

What about instead of using preview, we turn preview off, and use optional `dndHover(location)` callback on target delegate for real-time feedback.

To elaborate the purpose, we put a real-time clock on every boxes. You can see it keep updating the clock during a DnD session.