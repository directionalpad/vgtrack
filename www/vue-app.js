// Components
Vue.component('game-item', {
  props: ['id', 'title', 'description', 'release_date', 'platform', 'status', 'publishers', 'box_art_url', 'game'],
  methods: {
    convertDate: function(timestamp) {
      if(!isNaN(timestamp) && timestamp > 0) {
        return new Date(timestamp).toLocaleDateString(); 
      }

      return "Unknown";
    },
    addGame: function(game) {
      axios.post('http://localhost:5000/games', {
          title: game.title,
          description: game.description,
          release_date: game.release_date,
          platform: game.selectedPlatform,
          status: game.selectedStatus,
          publishers: game.publishers,
          box_art_url: game.box_art_url
      })
      .then(response => {
        console.log(response);
        document.getElementById(game.id).className = 'hide';
      });
    },
    removeGame: function(id) {
      axios.delete(`http://localhost:5000/games/${id}`)
      .then(response => {
        console.log(response);
        document.getElementById(id).className = 'hide';
      });
    }
  },
  template: `
  <div :id="id">
  <div class="game" >
    <div class="row">
        <div class="col-md-2">
          <img class="game-title-art" :src="box_art_url">
        </div>
        <div class="col-md-10">
            <div class="row">
                <div class="col-md-12">
                    <h2 class="game-title">
                      {{ title }}
                    </h2>
                </div>
            </div>
            <div class="row game-description">
                <div class="col-md-12">
                  {{ description }}
                </div>
            </div>
            <div class="row">
                        <div class="form-group col-md-2">
                            <label>Publisher(s)</label>
                            <label class="information-label">
                              {{ publishers.join(', ') }}
                            </label>
                        </div> 
                    <div class="form-group col-md-2">
                        <label>Release Date</label>
                        <label class="information-label">
                          {{ convertDate(release_date) }}
                        </label>
                    </div>

                    <div class="form-group col-md-4">
                        <label>Platform</label>
                        <label class="information-label" v-if="!Array.isArray(platform)">
                            {{ platform }}
                          </label>
                          <select class="col-md-2 form-control" name="platform" v-if="Array.isArray(platform)" v-model="game.selectedPlatform">
                            {{
                                <option v-for="p in platform" :value="p">{{ p }}</option>
                            }}
                          </select>
                      </div>

                    <div class="form-group col-md-2">
                        <label>Collection Status</label>
                        <label class="information-label" v-if="!Array.isArray(platform)">
                            {{ status }}
                        </label>
                        <select class="form-control col-md-2" name="status" v-if="Array.isArray(platform)" v-model="game.selectedStatus">}
                          <option value="Owned">Owned</option>
                          <option value="Wanted">Wanted</option>
                          <option value="For Sale">For Sale</option>
                        </select>
                    </div>

                    <div class="btn-group col-md-1">
                        <button @click="removeGame(id)" class="btn btn-warning game-add-button" data-original-title="Remove Game" v-if="!Array.isArray(platform)">
                          Remove Game
                        </button>
                        <button @click="addGame(game)" class="btn btn-success game-add-button" data-original-title="Add Game" v-if="Array.isArray(platform)">
                          Add Game
                        </button>
                    </div>
            </div>
        </div>
    </div>
  </div>
</div>
  `
});

// Views
const Games = { 
  data: function() {
    return { 
      games: []
   };
  },
  created: function() {
    axios.get('http://localhost:5000/games')
      .then(response => { 
        console.log(response);
        (this.games = response.data.games)
      });
  },
  template: `
    <div id="game-list">
      <game-item
      v-for="game in games"
      v-bind:title="game.title"
      v-bind:release_date="game.release_date"
      v-bind:description="game.description"
      v-bind:publishers="game.publishers"
      v-bind:platform="game.platform"
      v-bind:status="game.status"
      v-bind:box_art_url="game.box_art_url"
      v-bind:id="game.id"
      :key="game.id"
      >
      </game-item>
    </div>
  `};

const Search = {   
  data: function() {
    return { 
      title: '',
      games: []
   };
  },
  methods: {
    search: function() {
      axios.get(`http://localhost:5000/search?title=${encodeURIComponent(this.title)}`)
        .then(response => {
          this.games = response.data.games;
        });
    }
  },
  template: `
    <div id="game-list">

      <!-- Search Bar Template -->
      <div class="row">
        <div class="col-md-12 search-area" style="margin: 25px;">
          <div class="col-md-3"></div>
          <div class="col-md-6 search-bar">
            <input type="search" v-model="title" class="form-control" placeholder="Enter Video Game Title" />
          </div>
          <div class="col-md-2">
            <button @click="search" type="submit" class="btn search-button" name="search-button">Search</button>
          </div>
        </div>
      </div>
      <!-- End Search Bar Template -->

      <game-item
      v-for="game in games"
      v-bind:title="game.title"
      v-bind:release_date="game.release_date"
      v-bind:description="game.description"
      v-bind:publishers="game.publishers"
      v-bind:platform="game.platform"
      v-bind:box_art_url="game.box_art_url"
      v-bind:id="game.id"
      v-bind:game="game"
      :key="game.id"
      >
      </game-item>
    </div>
  `};

// Routing
const routes = [
  { path: '/', component: Games },
  { path: '/games', component: Games },
  { path: '/search', component: Search }
];

const router = new VueRouter({routes});

const app = new Vue({
  el: '#vue-app',
  router,
  component: Games,
  data: {
      games: [],
      currentRoute: window.location.pathname
  }
});