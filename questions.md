# 1. What is the difference between Component and PureComponent? Give an example where it might break my app.
In React, `Component` and `PureComponent` are two different base classes which have different approaches to rendering optimizations.

`Component`

- Basic Class: `Component` is the basic React component class. It oes not implement any special rendering optimizations.
- Rendering: By default, a `Component` re-renders whenever its parent component re-renders, regardless of whether the props or state have changed.
- Usage: Use Component when you need to manage state or handle lifecycle methods and don’t need built-in performance optimizations.

`PureComponent`

- Optimized Class: `PureComponent` extends `Component` but includes a shallow comparison of props and state in its `shouldComponentUpdate` method. This means that a `PureComponent` only re-renders when there is a change in its props or state.
- Rendering: It performs a shallow comparison of the current props and state with the next props and state. If they are the same, the component does not re-render.
- Usage: Use `PureComponent` when you want to optimize rendering performance by avoiding unnecessary re-renders based on prop and state changes.

Example Where `PureComponent` Might Break Your App

Consider a scenario where you have a `PureComponent` that receives complex objects or arrays as props:

```javascript
class ItemList extends React.PureComponent {
    render() {
        console.log("ItemList rendered");
        return (
            <ul>
                {this.props.items.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        );
    }
}
    
class App extends React.Component {
    state = {
        items: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' }
        ]
    };
    
    updateItemName = () => {
        this.setState(prevState => ({
            items: prevState.items.map(item =>
                item.id === 1 ? { ...item, name: 'Updated Item 1' } : item
            )
        }));
    };
    
    render() {
        return (
            <div>
                <ItemList items={this.state.items} />
                <button onClick={this.updateItemName}>Update Item</button>
            </div>
        );
    }
}
```

In this example:

Initial Rendering: `ItemList` will render the list of items when the `App` component mounts.

Updating State: When you click the "Update Item" button, `ItemList` should re-render with the updated item name.

Potential Issue: Since `PureComponent` uses shallow comparison, it only compares the reference of the `items` array. When the `updateItemName` method updates the `items` array, it creates a new array with a new reference. But if the new array is the same as the old one (because React's state update merges objects), `PureComponent` might not detect the change correctly.

Why This Might Break Your App

- Shallow Comparison: `PureComponent` uses shallow comparison for props and state, which means if the props or state are complex objects (like arrays or nested objects), and you update them without changing their references, `PureComponent` might not detect the updates.
- Mutable Updates: If you’re mutating objects or arrays directly instead of creating new references, `PureComponent` might not trigger re-renders as expected. For instance, in the example above, if `items` was not updated immutably, `PureComponent` might not trigger the necessary re-render.

While `PureComponent` can optimize rendering performance, it's important to ensure that props and state are updated immutably and that `PureComponent`'s shallow comparison aligns with app's requirements. If not, there might be issue where components don't re-render as expected, leaading to potentially broken UI states.

# 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

Danger of combining Context and `shouldComponentUpdate`

- The changes of Context trigger re-renders. Components that consume context are supposed to re-render whenever the context value changes. However, if you use `shouldComponentUpdate` in a way that prevents re-renders, you might inadvertently stop a component from updating even when the context it consumes changes.
- If you have complex logic in `shouldCompoentUpdate`, it might not account for changes in context values properly. For example, you might have a condition that prevents re-rendering based on props or state, but not consider context changes. This can lead to stale or incorrect UI.
- If components using context don't re-render when the context changes due to `shouldComponentUpdate` logic, it can lead to inconsistent or outdated UI states. The component might show stale data because it doesn't re-render despite context updates.

# 3. Describe  3  ways  to  pass  information  from  a  component  to  its PARENT.

1. Callback Functions (Event Handling)
    - You can pass a function from the parent component down to the child component as a prop. The child component then invokes this function when it needs to send data back to the parent.
    - The parent defines a function to handle the data and passes it as a prop to the child. When the child component wants to send information to the parent, it calls this function with the data as an argument.
2. State Management Libraries
    - For more complex applications, state management libraries like Redux or Zustand can be used to manage and share state across components, including parent-child relationship.
    - Both the parent and child components can interact with a global state or store. The child component updates the state, and the parent component reads from the updated state.
3. Context API
    - The Context API allows you to create a context that can be shared across the component tree. While it is typically used for sharing data from parent to child, it can also be used for passing information from child to parent by having the child update context values which the parent can observe.
    - You create a context and provide a value from the parent component. The child component can update this context, and the parent can read from the updated context.

# 4. Give 2 ways to prevent components from re-rendering.

1. Using `React.memo` (for Functional Components)
    - `React.memo` is a HOC that allows you to prevent a functional component from re-rendering if its props have not changed. It performs a shallow comparison of props to determine whether a re-render is necessary.
    - Wrap the functional component with `React.memo`, and it will only re-render when its props changes. This is particularly useful for optimizing performance when passing down props to child components that don't need to re-render on every parent update.
2. Using `shouldComponentUpdate` (for Class Components)
    - `shouldComponentUpdate` is a lifecycle method available in class components that allows you to control whether a component should re-render or not based on changes in props or state.
    - If `shouldComponentUpdate` returns `false`, the component will not re-render.

# 5. What is a fragment and why do we need it? Give an example where it might  break my app.

A fragment in React is a way to group multiple elements without introducing an additional DOM node. React Fragments are useful for grouping elements without adding extra nodes to the DOM, which can be particularly helpful for maintaining a clean and semantically correct HTML structure.

Why to use Fragments
1. Avoiding Extra Nodes: Without fragments, it might be necessary to warp component in an extra `<div>` or another HTML element. This can lead to unnecessary nodes in the DOM tree, which might affect CSS styling or layout and lead to a cluttered HTML structure.
2. Improving Performance: By avoiding unnecessary wrapper elements, it can reduce the complexity of DOM structure, which can improve rendering performance and reduce the likelihood of issues with styling and layout.
3. Maintaining Semantics: Fragments allow you to group elements without affecting the semantics of HTML. For example, it can return multiple elements from a component without wrapping them in a `<div>`, which is useful for maintaining semantic HTML.

Potential Issues with Fragments

1. Missing Key Prop in Lists: When using fragments within a list, it needs to provide a `key` prop to the fragment. If you forget to add the `key` prop, React will throw an error or warning, and your app might not render correctly. This is particularly important when rendering lists of fragments.

Example of issue:
```javascript
import React from 'react';

function ItemList() {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  
  return (
    <>
      {items.map(item => (
        <>
          <li>{item}</li>   {/* This will break because the fragment lacks a key */}
        </>
      ))}
    </>
  );
}

export default ItemList;
```

Correct Approach:
```javascript
import React from 'react';

function ItemList() {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  
  return (
    <ul>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <li>{item}</li>
        </React.Fragment>
      ))}
    </ul>
  );
}

export default ItemList;
```

2. Fragment with Children Not Allowed: Fragments themselves cannot have props like `className` or `style`, and you cannot apply these directly to fragments. If you need to style or apply specific attributes to the container, you'll need a regular HTML element.
```javascript
import React from 'react';

function StyledComponent() {
  return (
    <React.Fragment className="styled-fragment">
      <div>Content</div>
    </React.Fragment>
  );
}

export default StyledComponent;
```
In the example above, applying `className` directly to a fragment will not work because fragments do not support such attributes. Instead, you would need to use a `<div>` or another element if you need to apply styles or classes.

# 6. Give 3 examples of the HOC pattern.

The Higher-Order Component (HOC) pattern in React is a powerful technique for reusing component logic. An HOC is a function that takes a component and returns a new component with additional props or behavior. Here are three examples of the HOC pattern:

1. WithLoadingSpinner

This HOC adds a loading spinner to a component while data is being fetched. It enhances the wrapped component by showing a loading indicator based on a loading prop.

```javascript
import React from 'react';

// HOC that adds a loading spinner
const withLoadingSpinner = (WrappedComponent) => {
  return ({ isLoading, ...props }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
};

// Usage example
const DataDisplay = ({ data }) => {
  return <div>{data}</div>;
};

const DataDisplayWithLoading = withLoadingSpinner(DataDisplay);

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    // Simulate data fetch
    setTimeout(() => {
      setData('Fetched data');
      setIsLoading(false);
    }, 2000);
  }, []);

  return <DataDisplayWithLoading isLoading={isLoading} data={data} />;
}

export default App;
```

2. withErrorBoundary

This HOC wraps a component in an error boundary to handle JavaScript errors in its subtree gracefully. It catches errors, logs them, and displays a fallback UI.
```javascript
import React from 'react';

// HOC that adds error boundary handling
const withErrorBoundary = (WrappedComponent, FallbackComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by Error Boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <FallbackComponent />;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Fallback component to display in case of an error
const ErrorFallback = () => <div>Something went wrong!</div>;

// Usage example
const BrokenComponent = () => {
  throw new Error('This is an error!');
  return <div>This will not render</div>;
};

const SafeComponent = withErrorBoundary(BrokenComponent, ErrorFallback);

function App() {
  return <SafeComponent />;
}

export default App;
```

3. withAuth

This HOC adds authentication logic to a component, checking if the user is authenticated and either rendering the wrapped component or redirecting to a login page.
```javascript
import React from 'react';
import { Redirect } from 'react-router-dom';

// HOC that adds authentication handling
const withAuth = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Example check

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return <WrappedComponent {...props} />;
  };
};

// Usage example
const Dashboard = () => <div>Protected Dashboard</div>;

const AuthenticatedDashboard = withAuth(Dashboard);

function App() {
  return (
    <div>
      <AuthenticatedDashboard />
      {/* Make sure to set up a route for /login */}
    </div>
  );
}

export default App;
```

# 7. What's the difference in handling exceptions in promises, callbacks and async…await?

1. Promises

Promises have `.catch()` for handling errors that occur during the promise's execution. The `.catch()` method is called when a promise is rejected, allowing you to handle the error.
```javascript
// Example of promise rejection handling
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Failed to fetch data'));
    }, 1000);
  });
};

fetchData()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```
In this example, if the promise is rejected, the `.catch()` method handles the error.
2. Callbacks

Callbacks commonly use an "error-first" pattern where the first argument of the callback function is reserved for an error (if any), and subsequent arguments are for data.
```javascript
// Example of callback error handling
const fetchData = (callback) => {
  setTimeout(() => {
    callback(new Error('Failed to fetch data'), null);
  }, 1000);
};

fetchData((error, data) => {
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  console.log(data);
});
```
In this example, if there's an error, it's passed as the first argument to the callback. The code checks for this error before processing the data.
3. Async ... Await

`async`/`await` allows you to write asynchronous code that looks synchronous and you handle exceptions using standard `try`/`catch` blocks.
```javascript
// Example of async/await error handling
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Failed to fetch data'));
    }, 1000);
  });
};

const fetchDataAsync = async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fetchDataAsync();
```
In this example, `await` is used to wait for the promise to resolve or reject, and `try`/`catch` is used to handle any errors that occur.

# 8. How many arguments does setState take and why is it async.

In React, `setState` is a method used to update the state of the component. It has several arguments.

Arguments of `setState`

There are object, function, and callback

1. Object Argument

It's just object where the keys correspond to state properties to be updated.
```javascript
this.setState({ count: this.state.count + 1 });
```

2. Function Argument

This function receives the previous state and props as arguments and returns an object to update the state. This is useful when the new state depends on the previous state.
```javascript
this.setState((prevState, props) => ({
  count: prevState.count + 1
}));
```

3. Callback Argument

After `setState` has updated the state and re-rendered the component, you can provide a callback function that gets executed. This is useful for operations that depend on the state update having been completed.
```javascript
this.setState({ count: this.state.count + 1 }, () => {
  console.log('State updated:', this.state.count);
});
```

Why `setState` is Asynchronous

1. Batching of State Updates

React batches multiple `setState` calls into a single update to optimize performance. This means that multiple state updates within the same synchronous block of code may be batched and processed together.

2. Efficiency Considerations

Updating the DOM is an expensive operation. By making `setState` asynchronous, React can minimize the number of re-renders and optimize performance by applying state changes in a controlled manner.

3. Consistency in Rendering

React’s reconciliation process ensures that updates are applied in a consistent way. This process involves scheduling updates and applying them in batches, allowing React to manage state changes and UI updates efficiently.

# 9. List the steps needed to migrate a Class to Function Component.

1. Migrate the Class Component

Firstly, identify if it's class component or functional component.

2. Convert the Class to a Function Component

Replace the class definition with a function component. The `render` method will be replaced by the function's return value.

3. Convert State Management

Use the `useState` hook to manage state instead of using `this.state` and `this.setState`

4. Convert Lifecycle Methods

If the class component has lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`), replace them with the appropriate hooks

- `componentDidMount`: Use `useEffect` with an empty dependency array.
- `componentDidUpdate`: Use `useEffect` with dependencies
- `componentWillUnmount`: Use `useEffect` with cleanup function

```javascript
componentDidMount() {
  console.log('Component mounted');
}

componentDidUpdate(prevProps, prevState) {
  console.log('Component updated');
}

componentWillUnmount() {
  console.log('Component will unmount');
}
```

```javascript
import React, { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component will unmount');
    };
  }, []);

  useEffect(() => {
    console.log('Component updated');
  }, [count]); // Only run if `count` changes

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};
```

5. Convert Event Handlers and Methods

Event handlers should be defined inside the function component. Ensure that you use functions instead of class methods.

6. Replace Context and Refs (if applicable)

If the class component uses `context` or `refs`, convert these using `useContext` and `useRef` respectively.

7. Test the Function Component

After migration, thoroughly test the function component to ensure it behaves as expected and that all functionalities are preserved.

# 10. List a few ways styles can be used with components.

1. Inline Styles

Styles are applied directly within the component using a style attribute. Styles are defined as a JavaScript object.
```javascript
const MyComponent = () => {
  const style = {
    color: 'blue',
    backgroundColor: 'lightgrey',
    padding: '10px'
  };

  return (
    <div style={style}>
      This is a styled div!
    </div>
  );
};
```
2. CSS Stylesheets

Use traditional CSS stylesheets linked to the component via class names.
```css
/* styles.css */
.myComponent {
  color: blue;
  background-color: lightgrey;
  padding: 10px;
}
```
```javascript
import './styles.css';

const MyComponent = () => {
  return (
    <div className="myComponent">
      This is a styled div!
    </div>
  );
};
```
3. CSS Modules

CSS Modules allow you to scope CSS by automatically generating unique class names.
```css
/* MyComponent.module.css */
.myComponent {
  color: blue;
  background-color: lightgrey;
  padding: 10px;
}
```
```javascript
import styles from './MyComponent.module.css';

const MyComponent = () => {
  return (
    <div className={styles.myComponent}>
      This is a styled div!
    </div>
  );
};
```
4. Styled Components

Use the `styled-components` library to create components with encapsulated styles using tagged template literals.
```javascript
import styled from 'styled-components';

const StyledDiv = styled.div`
  color: blue;
  background-color: lightgrey;
  padding: 10px;
`;

const MyComponent = () => {
  return (
    <StyledDiv>
      This is a styled div!
    </StyledDiv>
  );
};
```
5. Emotion

A library for writing CSS styles with JavaScript, similar to `styled-components`. Supports both styled components and CSS-in-JS.
```javascript
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const style = css`
  color: blue;
  background-color: lightgrey;
  padding: 10px;
`;

const MyComponent = () => {
  return (
    <div css={style}>
      This is a styled div!
    </div>
  );
};
```
6. Scoped CSS

coped CSS is often used in frameworks like Vue, but similar approaches can be applied in React using libraries like `styled-components` or CSS Modules.

# 11. How to render an HTML string coming from the server.

1. Using `dangerouslySetInnerHTML`

React provides a built-in way to render raw HTML by using the `dangerouslySetInnerHTML` attribute. As the name suggests, this method should be used with caution because it can expose your application to XSS attacks if the HTML string is not properly sanitized.
```javascript
const MyComponent = () => {
  const htmlString = "<p>Hello, <strong>world</strong>!</p>";

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
};
```
2. Using Libraries for Sanitization

To ensure the HTML content is safe, use a library like DOMPurify to sanitize the HTML string before rendering it.
```javascript
const htmlString = "<p>Hello, <script>alert('XSS');</script> <strong>world</strong>!</p>";

const App = () => {
  return (
    <MyComponent htmlString={htmlString} />
  );
};
```

3. Using React Markdown Libraries

If you are working with markdown that needs to be rendered as HTML, you can use libraries like react-markdown which can safely convert markdown to HTML.
```javascript
const markdown = "# Hello, **world**!";

const App = () => {
  return (
    <MyComponent markdown={markdown} />
  );
};
```

4. Handling Dynamic Content

If the HTML content is dynamic and received from an external source, always sanitize it before rendering, especially if it comes from user input or untrusted sources.
```javascript
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

const MyComponent = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/api/get-html-content')
      .then(response => response.text())
      .then(data => {
        const cleanHtml = DOMPurify.sanitize(data);
        setHtmlContent(cleanHtml);
      });
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};
```