<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">To Do List</h3>

        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true">
                    Tambah
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="todos" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="icnote mr-2" @click="detailItem(item)" color="purple darken-2">
                        {{ icons.mdiTextBoxSearchOutline }}
                    </v-icon>
                    <v-icon small class="pencil mr-2" @click="editItem(item)" color="blue darken-2">
                        {{ icons.mdiPencil }}
                    </v-icon>
                    <v-icon small class="bin mr-2" @click="deleteItem(item)" color="red darken-2">
                        {{ icons.mdiDelete }}
                    </v-icon>
                    <input type="checkbox" v-model="item.hapus" style="margin-left: 100px;" @change="checked(item)">
                </template>
                <template v-slot:[`item.priority`]="{ item }">
                    <span v-if="item.priority == 'Penting'">
                        <v-chip
                        class="ma-2"
                        color="red"
                        text-color="white"
                        >
                        Penting
                        </v-chip>
                    </span>
                    <span v-else-if="item.priority == 'Tidak penting'">
                        <v-chip
                        class="ma-2"
                        color="green"
                        text-color="white"
                        >
                        Tidak Penting
                        </v-chip>
                    </span>
                    <span v-else>
                        <v-chip
                        class="ma-2"
                        color="primary"
                        >
                        Biasa
                        </v-chip>
                    </span>
                </template>
                    
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Form Todo</span>
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
                        :items="['Penting', 'Biasa', 'Tidak penting']"
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
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel 
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save" v-if="adding == true">
                        Save
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="update(formTodo)" v-if="editing == true">
                        Update 
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogdelete" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Yakin ingin menghapus?</span>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="cancel">
                            Tidak
                        </v-btn>

                        <v-btn color="red darken-1" text @click="destroy">
                            Ya
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogdetail" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">
                        {{detail.task}}
                    </span>
                </v-card-title>

                <v-card-text>
                <v-card v-if="detail.priority == 'Penting'" outlined>
                    <v-chip
                    class="ma-2"
                    color="red"
                    text-color="white"
                    >
                    Penting
                    </v-chip>
                </v-card>
                <v-card v-else-if="detail.priority == 'Biasa'" outlined>
                    <v-chip
                    class="ma-2"
                    color="green"
                    text-color="white"
                    >
                    Tidak Penting
                    </v-chip>
                </v-card>
                <v-card v-else outlined>
                    <v-chip
                    class="ma   -2"
                    color="primary"
                    >
                    Biasa
                    </v-chip>
                </v-card>
                {{detail.note}}
            </v-card-text>

            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="cancel">
                    Close
                </v-btn>
            </v-card-actions>

            </v-card>            
        </v-dialog>

        <v-card v-if="selectedItem.length">
            <v-card-title>Delete Multiple</v-card-title>
            <v-card-text>
                <ul v-for="(todo, index) in selectedItem" :key="index">
                    <li>
                       {{todo.task}} 
                    </li>
                </ul>
            </v-card-text>
            <v-card-actions>
                <v-btn color="red darken-1" @click="hapusSemua" class="white--text">
                Hapus Semua 
            </v-btn>
            </v-card-actions>
        </v-card>

    </v-main>
</template>
<script>

import {
    mdiPencil,
    mdiDelete,
    mdiTextBoxSearchOutline,
}from '@mdi/js'

export default {
    name: "List",
    data(){
        return{
            search: null,
            dialog: false,
            dialogdelete: false,
            adding: true,
            editing: false,
            itemedit: null,
            dialogdetail: false,
            icons:{
                mdiPencil,
                mdiDelete,
                mdiTextBoxSearchOutline
            },
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
                    hapus: false
                },
                {
                    task: "nongkrong",
                    priority: "Tidak penting",
                    note: "bersama teman-teman",
                    hapus: false
                },
                {
                    task: "masak",
                    priority: "Biasa",
                    note: "masak air 500ml",
                    hapus: false
                },
            ],
            selectedItem: [],
            formTodo: {
                task: null,
                priority: null,
                note: null,
                hapus: false,
            },
            detail:{
                task: null,
                priority: null,
            }
        };
    },
    methods: {
        save() {
            this.todos.push(this.formTodo);
            this.resetForm();
            this.dialog = false;
            this.adding = true;
            this.editing = false;
        },
        cancel(){
            this.resetForm();
            this.dialogdetail = false;
            this.dialogdelete = false;
            this.itemedit = null;
            this.dialog = false;
            this.adding = true;
            this.editing = false;
        },
        resetForm(){
            this.formTodo = {
                task: null,
                priority: null,
                note: null,
            };
        },
        editItem(item){
            this.editing = true,
            this.adding = false,
            this.formTodo = {
                task: item.task,
                priority: item.priority,
                note: item.note
            }
            this.dialog = true,
            this.itemedit = item;
        },
        update(formTodo){
            this.itemedit.task = formTodo.task;
            this.itemedit.priority = formTodo.priority;
            this.itemedit.note = formTodo.note;
            this.cancel();
            
        },
        deleteItem(item){
            this.dialogdelete = true;
            this.itemedit = item;
        },
        destroy(){
            this.todos.splice(this.todos.indexOf(this.editItem), 1);
            this.dialogdelete = false;
        },
        detailItem(item){
            this.detail = {
                task: item.task,
                priority: item.priority,
                note: item.note
            }
            this.dialogdetail= true;
        },
        checked(item){
            if(item.hapus){
                this.selectedItem.push(item);
            }else{
                let position = this.selectedItem.findIndex(el=>el.task === item.task);
                this.selectedItem.splice(position, 1);
            }
        },
        hapusSemua(){
            this.todos = this.todos.filter(el=>!this.selectedItem.includes(el));
            this.selectedItem = [];
        }
    },
};

</script>