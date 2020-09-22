<template>
  <div class="bg-sidebar sidebar">
    <p class="title">preference</p>
    
    <!-- Background color controller -->
    <div class="preference">
      <p class="preference-title">Background color</p>
      <div class="text-left">
        <v-menu 
          offset-y 
          :close-on-content-click="false"
          >
        <template v-slot:activator="{ on }">
          <v-btn
            :color="color"
            dark
            v-on="on"
            class="mr-2"
          >
          </v-btn>
          <span>{{color.slice(0, 7)}}</span>
        </template>
        <v-color-picker
          value="#7417BE"
          v-model="color"
          show-swatches
          class="mx-auto"
        ></v-color-picker>
        </v-menu>
      </div>
    </div>

    <!-- Dimension controller -->
  </div>
</template>

<script>
module.exports = {
  name: 'preference',
  data: function () {
    return {
      color: '#FFF7B0',
    }
  }
}
</script>

<style scoped>
.sidebar {
  padding: 1.2rem;
}

p {
  margin: 0;
}

.title {
  font-size: 1.5rem;
}

.preference {
  margin: 20px 0 0 0;
}

.preference-title {
  margin-bottom: 10px;
}

</style>