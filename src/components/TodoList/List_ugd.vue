<template>
    <v-main class = "list">
        <h3 class = "text-h3 font-weight-medium mb-5" >To Do List</h3 >
        <v-card>
            <v-card-title>
                <v-text-field
                v-model = " search "
                append-icon = " mdi-magnify "
                label = " Search "
                single-line
                hide-details
                ></v-text-field>
            <v-spacer ></v-spacer>

                        <v-btn color="succsess" dark @click="dialog = true">
                    Tambah
                </v-btn>
            </v-card-title>



            <v-data-table 
            :headers="headers" 
            :items="todos" 
            :search="search">

                <template v-slot:[`item.priority`]="{ item }">
                    <td>
                        <v-card v-if="item.priority == 'Penting'" style="border-color: lightcoral; color: lightcoral; width: fit-content;" outlined>
                            {{ item.priority }}
                        </v-card>
                        <v-card v-else-if="item.priority == 'Biasa'" style="border-color: lightblue; color: lightblue; width: fit-content;" outlined>
                            {{ item.priority }}
                        </v-card>
                        <v-card v-else outlined style="border-color: lightgreen; color: lightgreen; width: fit-content;">
                            {{ item.priority }}
                        </v-card>
                    </td>
                </template>
                
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="editItem(item)">
                        edit
                    </v-btn>

                    <v-btn small @click="deleteItem(item)">
                        delete
                    </v-btn>
                </template>
                
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">From Todo</span>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-text-field
                        v-model="formTodo.task"
                        label="Task"
                        required
                        ></v-text-field>

                        <v-select
                        v-model="formTodo.priority"
                        :items="['Penting', 'Biasa', 'Tidak Penting']"
                        label="Priority"
                        required
                        ></v-select>

                        <v-textarea
                        v-model="formTodo.note"
                        label="Note"
                        required
                        ></v-textarea>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="blue darken-1"  v-if="formTodo.task == null" 
                    text @click="cancel">
                        Cancel
                    </v-btn>

                    <v-btn color="blue darken-1" v-if="formTodo.task == null" 
                    text @click="save">
                        Save
                    </v-btn>

                    <v-btn color="blue darken-1" v-if="formTodo.task != null"  
                    text @click="updateItem">
                        Update / Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
export default {
    name: "List_ugd",
    data(){
        return {
            search: null,
            dialog: false,
            headers: [
                {
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                { text: "Priority", value: "priority" },
                { text: "Note", value: "note" },
                { text: "Actions", value: "actions" },
            ],

            todos: [
                {
                    task: "bernafas",
                    priority: "Penting",
                    note: "huffttt",
                },
                {
                    task: "nongkrong",
                    priority: "Tidak Penting",
                    note: "bersama tman2",
                },
                {
                    task: "masak",
                    priority: "Biasa",
                    note: "masak air 500ml",
                },
            ],

            formTodo: {
                task: null,
                priority: null,
                note: null,
            },
        };
    },
    
    methods: {
        save(){
            this.todos.push(this.formTodo);
            this.resetForm();
            this.dialog = false;
        },

        cancel(){
            this.resetForm();
            this.dialog = false;
        },

        resetForm(){
            this.formTodo = {
                task: null,
                priority: null,
                note: null,
            };
        },
        
        deleteItem(item){
            let index = this.todos.indexOf(item)
         confirm('Yakin ingin menghapus?')  && this.todos.splice(index, 1)
        },

        deleteItemEdit(item){
            this.todos = this.todos.filter(todo => todo !== item);
        },

        editItem(item){
            this.formTodo = {
                task: item.task,
                priority: item.priority,
                note:  item.note,
            }
            this.dialog = true;
            this.deleteItemEdit(item)
        },

        updateItem(){
            this.save();
        },
    },
};
</script>