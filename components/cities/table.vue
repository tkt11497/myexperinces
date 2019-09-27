<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        browser-autocomplete="off"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="cities"
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="[25]"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ !props.item.is_collect_only ? "No" : "Yes" }}</td>
        <td>{{ !props.item.is_on_demand ? "No" : "Yes" }}</td>
        <td>{{ !props.item.is_available_d2d ? "No" : "Yes" }}</td>
        <td class="justify-center layout px-0" wrap>
           <v-btn color="blue darken-1" flat icon @click="editCity(props.item)">
              <v-icon>edit</v-icon>
            </v-btn>
             <v-btn color="red darken-1" flat icon @click="deleteCity(props.item)">
              <v-icon>delete</v-icon>
            </v-btn>
          <!-- <v-icon small class="mr-2" @click="editCity(props.item)">edit</v-icon>
          <v-icon small @click="deleteCity(props.item)">delete</v-icon> -->
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: {
    cities: { type: Array, required: true }
  },
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Collect Only", value: "is_collect_only" },
        { text: "On Demand", value: "is_on_demand" },
        { text: "Available D2D", value: "is_available_d2d" },
        { text: "Actions", value: "name", sortable: false, width: "50" }
      ],
      search: "",
      pagination: {
        sortBy: "id",
        descending: true
      }
    };
  },
  methods: {
    editCity(city) {
      this.$emit("openEditCityForm", city);
    },
    deleteCity(city) {
      this.$emit("openDeleteCityConfirmation", city);
    }
  }
};
</script>
