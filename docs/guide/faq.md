# FAQ

## Does it support Vue 2?
No, v0.1 requires Vue 3 + Pinia 2.

## Does it support nvue?
Not in v0.1. Planned for v0.2.

## Why Pinia and not a vanilla store?
Hot reload, devtools, and TS inference. The store is internal — consumers don't interact with it.

## What about React Native / mini-program SDKs from other frameworks?
Out of scope. uniapp-specific.

## How do I disable animations?
Override CSS variables:

```css
:root { --guide-transition-duration: 0s; }
```

## Why does the mask not appear on Xiaohongshu mini-program?
Xiaohongshu / less-mainstream MPs are best-effort in v0.1. File issues with reproduction; Tier-2 support comes in v0.2.
