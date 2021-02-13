<template>
  <div class="admin">
    <section class="loading">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
    </section>
    <div class="pagination">
      <jw-pagination :items="filterProducts" @changePage="onChangePage" :page-size="12"></jw-pagination>
    </div>
      <input class="searcher" v-model="searcher" placeholder="szukaj"/>
      <div class="container-for-table">`
          <table class="table-for-photo">
              <thead>
                  <th>Zdjęcie</th>
                  <th>Kategoria</th>
                  <th>Nazwa</th>
                  <th>Kolor</th>
                  <th>Nazwa zdjęcia</th>
                  <th>Dodaj </th>
                  <th>Usuń</th>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in pageOfItems" :key="index">
                      <td>
                        <img class="small-image" :src="getPhoto(item.photo)" alt="PHOTO">
                      </td>
                      <td>
                        <span> {{item.category}} </span>
                      </td>
                      <td>
                        <span> {{item.name}} </span>
                      </td>
                      <td>
                        <span> {{item.color}} </span>
                      </td>
                      <td>
                        <span> {{item.photo }}</span>
                      </td>
                      <td>
                        <label class="add">
                          <input :class="item.photo" :name="item.photo" ref='file' type="file" @change="previewFiles"/>
                            1000x1500 PNG
                        </label>
                      </td>
                      <td>
                        <button @click="removePhoto(item.photo)" class="remove">Usuń</button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  </div>
</template>

<script>
import slugify from "slugify";
import axios from 'axios'

export default {
  name: "Admin",
  data(){
    return{
      sortCategories: [],
      pageOfItems: [],
      searcher: "",
      value: File,
      categories: [
        {
          category: 'Szlafroki Damskie Dlugie',
          products: []
        },
        {
          category: 'Szlafroki Damskie Krotkie',
          products: []
        },
        {
          category: 'Szlafroki Meskie',
          products: []
        },
        {
          category: 'Kombinezony',
          products: []
        },
        {
          category: 'Szlafroki Dzieciece',
          products: []
        }
      ],
    }
  },
  computed: {
    filterProducts: function() {
      return this.sortCategories.filter((product) => {
        if (product.name.toLowerCase().match(this.searcher.toLowerCase()) ||
            product.category.toLowerCase().match(this.searcher.toLowerCase()) ||
            product.photo.toLowerCase().match(this.searcher.toLowerCase())) {
          return product
        }
      })
    }
  },
  methods: {
    onChangePage( pageOfItems) {
      this.pageOfItems = pageOfItems;
    },
    async makeProducts() {
      let products = [];
      products = await this.$store.dispatch('getProducts')

      const checkAll = (name, color, photo, size, category) => {
        this.sortCategories.push({
          name,
          color,
          photo,
          category: this.categories[category].category
        })
      }

      await products.forEach((el) => {
        let photo = (el.Nazwa[0] + '_' + el.Kolor[0]).split(' ').join('_')

        //never move

        let size = slugify(el.Rozmiar[0], {
          replacement: '',
          remove: /[$*+~.()'"!/\-:@]/g,
        })

        let sizeEAN = {
          size,
          EAN: el.$.EAN
        }

        const photoReplaced = slugify(photo, {
          replacement: '_',
          remove: /[$*+~.()'"!/\-:@]/g,
          lower: true
        })

        switch (el.NazwaKategorii[0]) {
          case "SZLAFROK DAMSKI DŁUG":
            checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 0)
            break;
          case "SZLAFROK DAMSKI ":
            checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 1)
            break;
          case "SZLAFROK MĘSKI":
            checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 2)
            break;
          case "KOMBINEZON":
            checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 3)
            break;
          case "SZLAFROK DZIECIECY":
            checkAll(el.Nazwa[0], el.Kolor[0], photoReplaced, sizeEAN, 4)
            break;
          default:
            break;
        }})
    },
    getPhoto(photo) {

      const slug = slugify(photo, {
        replacement: '_',
        remove: /[$*+~.()'"!/\-:@]/g,
        lower: true
      })

      return this.$store.state.hostName + 'v2/file/image/' + slug + '.png'

    },

    removeDuplicates(array) {
      const arrayOfString = array.map((value) => {
        return JSON.stringify(value)
      })
      return [...new Set(arrayOfString)].map((value) => {
        return JSON.parse(value)
      })
    },

    previewFiles(e){
      const formData = new FormData();
      if (e.target.files[0].type === 'image/png') {
        formData.append('image', e.target.files[0])
        formData.append('name', e.target.classList[0])
        this.$store.dispatch('sendPhotoToBackend', formData)
        .then(async () => {
          await this.makeProducts()
          this.sortCategories = this.removeDuplicates(this.sortCategories)

          axios({
            url: this.$store.state.hostName + 'v2/file/image/' + e.target.classList[0] + '.png',
            method: 'GET',
            responseType: 'blob',
          }).then((response) => {
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement('a');

            fileLink.href = fileURL;
            fileLink.setAttribute('download', e.target.classList[0] + '.png');
            document.body.appendChild(fileLink);

            fileLink.click();
          });
        })
        .catch(err => console.log(err))
      } else {
        window.alert('Nie jest png')
      }

    },

    removePhoto(photo) {
      this.$store.dispatch('deletePhotoFromBackend', photo)
    }

  },
  async created() {
    this.$store.dispatch('adminToken')
    await this.makeProducts()
    this.sortCategories = this.removeDuplicates(this.sortCategories)
  }
}
</script>

<style lang="scss" scoped>



.admin {
  font-family: 'Oswald', sans-serif;
}




.pagination {
  position: absolute;
  font-size: 0.875rem;
  width: 800px;
  left: 5%;
  top: 4%;

  ::v-deep .page-link {
    border: 1px solid lightgray;
  }

  ::v-deep .active {
    .page-link {
      color:  blue;
    }
  }

}

.searcher {
  position: absolute;
  right: 8%;
  top: 3.5%;
  width: 200px;
}

.container-for-table {
  width: 85vw;
  margin-left: 7.5vw;
  margin-top: 150px;
  padding-bottom: 100px;

  table {
    border: 1px solid lighten(#b1b1be, 16);
  }

  thead {
    background-color: #efefef;
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: normal;
    letter-spacing: 1px;

    th {
      text-align: center;
      font-weight: normal;
      border-right: 1px solid lighten(#b1b1be, 16);


      &:last-child {
        border-right: none;
      }
    }
  }

  tbody {

    tr {
      td {

        text-align: center;

        button {
          padding: 4px 12px 4px 12px;
          border-radius: 5px;
          cursor: pointer;
          color: white;
          transition: .3s;
          font-weight: bold;

          &:hover {
            opacity: 0.8;
            color: #FBEED5;
          }

          &:active {
            background-color: purple;
            border: 4px solid purple;
          }
        }


        .add {

          input[type="file"] {
            display: none;
          }

        }

        .remove {
          background-color: crimson;
          border: 4px solid crimson;
          font-family: 'Oswald', sans-serif;
        }

        img {

          width: 80px;
        }
      }
    }
  }
}

</style>