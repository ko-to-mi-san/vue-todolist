var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
    fetch: function(){
        var todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}


new Vue({
    el: '#app',
    data:{
        // 使用するデータ
        todos:[],
        current: -1,
        options:[
            { value: -1, label:'すべて' },
            { value: 0, label:'未着手' },
            { value: 1, label:'作業中' },
            { value: 2, label:'完了' }
        ]
    },

    computed:{
        computedTodos: function(){
            return this.todos.filter(function(el) {
                return this.current < 0 ? true : this.current ===el.state
            }, this)
        },

        labels(){
            return this.options.reduce(function (a,b) {
                return Object.assign(a, {[b.value]: b.label })
            }, {})
        }
    },

    watch: {
        todos:{
            handler: function(todos) {
                todoStorage.save(todos)
            },
            deep: true
        }
    },

    created(){
        this.todos = todoStorage.fetch()
    },

    methods: {
        // 使用するメソッド
        doAdd: function(event, value) {
            var comment = this.$refs.comment
            var date = this.$refs.date
            if(!comment.value.length) {
                return
            }
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                date: date.value,
                state: 0
            })
            comment.value = ''
            date.value = ''
        },

        doChangeState: function(item) {
            item.state = item.state === 0 ? 1 : item.state === 1 ? 2 : 0
        },

        doRemove: function(item) {
            var index = this.todos.indexOf(item)
            this.todos.splice(index,1)
        }
    }
})