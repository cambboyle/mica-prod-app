import Todo from '../models/todoModel';

class TodoService {
  async getTodos(userId: number) {
    return Todo.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async createTodo(userId: number, title: string) {
    return Todo.create({
      title,
      userId,
      status: 'PENDING',
    });
  }

  async toggleTodoStatus(todoId: number, userId: number) {
    const todo = await Todo.findOne({
      where: { id: todoId, userId },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    const newStatus = todo.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    return todo.update({ status: newStatus });
  }

  async deleteTodo(todoId: number, userId: number) {
    const todo = await Todo.findOne({
      where: { id: todoId, userId },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    await todo.destroy();
    return todo;
  }
}

export default new TodoService();
