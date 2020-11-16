import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () =>
        import (`./components/${ path }.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [{
        path: "/",
        name: "admin",
        component: importComponent('DashboardLayout'),
        children: [
            // Dashboard
            {
                path: "/",
                name: "Root",
                component: importComponent('Dashboard'),
            },
            // To do list
            {
                path: "/gd",
                name: "Guided",
                component: importComponent('TodoList/List'),
            },
            // To do list
            {
                path: "/ugd",
                name: "Unguided",
                component: importComponent('TodoList/List_ugd'),
            },
            // To do list
            {
                path: "/tgs",
                name: "Tugas",
                component: importComponent('TodoList/listTugas'),
            },
        ]
    }, ]
});
export default router;