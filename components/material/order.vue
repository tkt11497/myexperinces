<template>
    <v-card>
                   <v-data-table
    :headers="headers"
    :items="loadedorder"
    :sort-by="['deliverystatus']"
    :sort-desc="[false, true]"
    multi-sort
    class="elevation-1" :loading="isloading" loading-text="Loading... Please wait" 
    id="table2"
  >
     <template v-slot:item.action="{ item }">
      <v-chip @click="addordertopickup(item)" color=blue>ADD</v-chip>
    </template>
    {{loadedorder}}
  </v-data-table>
    </v-card>


         

</template>
<script>
export default {
    created() {
 console.log(this)
     return this.$axios.get("https://stecomlikepos.firebaseio.com/order.json")
                     .then((res) => {
                         let loadedordery = []
                         for (const key in res.data) {
                             loadedordery.push({...res.data[key], id: key })
                                 //console.log(productarray)
                         }
                         this.loadedorder=loadedordery
                        
                         //context.store.commit('setorder', orderarray)
                     })
                     .catch((e) => { console.log(context.error(e)) })

     },
     asyncData(context) {
         console.log(this)
    return $axios.get("https://stecomlikepos.firebaseio.com/order.json")
                    .then((res) => {
                        let loadedorder = []
                        for (const key in res.data) {
                            loadedorder.push({...res.data[key], id: key })
                                //console.log(productarray)
                        }
                        return loadedorder
                        
                        //context.store.commit('setorder', orderarray)
                    })
                    .catch((e) => { console.log(context.error(e)) })
        
    },
    data(){
        return{
            loadedorder:[],
             headers: [
          {
            text: 'Order Status',
            align: 'left',
            value: 'deliverystatus',
          },
          { text: 'Customer Name', value: 'name' },
          { text: 'Phone Number', value: 'phno' },
          { text: 'Address', value: 'address' },
          { text: 'Email', value: 'email' },
          { text: 'Order Date', value: 'date' },
          { text: 'Total Item', value: 'totalitem' },
          { text: 'Total Price', value: 'totalprice' },
          { text: 'Payment Type', value: 'paymenttype' },
          { text: '',value:'action'},
        ],
        isloading:false
        
      }
        
    },
    methods: {
        addordertopickup(item){
            console.log(item+'fyu')
            this.$emit('addingordertopickup',item)
        }
    },
}
</script>