<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view v-if="!loading"></router-view>
  </div>
</template>

<script>
import {
    onLoadMixin
} from './onLoadMixin.js';
export default {
	mixins: [onLoadMixin]
}
</script>

<style></style>
