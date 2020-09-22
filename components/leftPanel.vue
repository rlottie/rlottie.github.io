<template>
  <div class="bg-sidebar">
    <!-- preview -->
    <div class="container my-3">
      <div class="row no-gutters">
        <img class="img-thumbnail preview-thumbnail" src="" alt="preview">
        <h3 class="my-auto ml-4">Filename</h3>
      </div>
    </div>

    <!-- search bar -->
    <div class="container my-3">
      <p class="title">Search layer</p>
      <div class="row no-gutters">
        <button class="btn col-2"><i class="text-white fas fa-search fa-lg"></i></button>
        <input v-model="searchKeyword" type="text" class="searchInput rounded-pill col-10">
      </div>
    </div>

    <!-- layer list -->
    <div class="container my-3">
      <p class="title">Layers</p>
      <div class="container" v-for="layer in layers" :key="layer">
        <div class="row no-gutters my-4">
          <img class="img-thumbnail layer-thumbnail" src="" :alt="layer">
          <p class="layer-name my-auto ml-4">{{ layer }}</p>
          <button class="btn ml-auto"><i class="text-white far fa-eye"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'leftpanel',

  data: function () {
    return {
      'searchKeyword': null,
      'layers': [
        'layer1',
        'layer2',
        'layer3'
      ],
    }
  }
}
</script>

<style scoped>
  .title {
    font-size: 1.5rem;
  }

  .layer-name {
    font-size: 1.2rem;
  }

  .preview-thumbnail {
    width: 70px;
    height: 70px;
  }

  .layer-thumbnail {
    width: 60px;
    height: 60px;
  }
</style>