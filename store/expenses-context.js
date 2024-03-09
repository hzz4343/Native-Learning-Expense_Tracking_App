import { createContext, useReducer } from 'react';

// context用来做外部链接，定义所有函数，方便外部使用
export const ExpensesContext = createContext({
  expense: [],
  addExpense: ({ description, amount, date }) => {},
  setExpenses: ({ expenses }) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

// reducer这个函数用来做计算
//之类的state指的是原来的内容，action指的是传入的数据
function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];

    case 'SET':
      const inverted = action.payload.reverse();
      return inverted;
    case 'UPDATE':
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      //找到要更新的原内容
      const updatableExpense = state[updatableExpenseIndex];
      //把原内容加上要更新的内容变成新内容
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      //找到原来的总内容
      const updatedExpenses = [...state];
      //在总内容里更新新内容
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
    //最后所有case计算后返回的都是state，也就是expense的数据数组（像dummy data那样的格式）
  }
}

// context provider用来跟外部链接，要写在<app>里
function ExpensesContextProvider({ children }) {
  const [expenseState, dispatch] = useReducer(expensesReducer, []);

  //payload指的是要传入的数据
  function addExpense(expenseData) {
    dispatch({ type: 'ADD', payload: expenseData });
  }

  function setExpenses(expenses) {
    dispatch({ type: 'SET', payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: 'DELETE', payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: 'UPDATE', payload: { id: id, data: expenseData } });
  }

  // 最后的数据结果
  const value = {
    expenses: expenseState,
    addExpense: addExpense,
    setExpenses: setExpenses,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
