import React, { Component } from 'react';

class Menu extends Component {
  state = {
    isCollapsed: true,
    items: [],
  };

  static getElements = () => [...document.getElementsByClassName('example')];

  componentDidMount() {
    const elements = Menu.getElements();
    const items = elements.map(item => ({
      id: item.getAttribute('id'),
      name: item.getAttribute('data-title'),
      href: `#${item.getAttribute('id')}`,
      active: false,
    }));

    this.setState({
      items,
    });

    this.io = new IntersectionObserver(this.onObserve, {
      rootMargin: '-35%',
    });
    elements.forEach(el => this.io.observe(el));
  }

  componentWillUnmount() {
    const elements = Menu.getElements();
    elements.forEach(el => this.io.unobserve(el));
    this.io.disconnect();
    this.io = null;
    document.body.className = 'nav-open';
  }

  onObserve = entries => {
    const inIds = [];
    const outIds = [];
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      if (entry.isIntersecting) {
        inIds.push(id);
      } else {
        outIds.push(id);
      }
    });
    this.setState(prevState => {
      const { items } = prevState;
      const newItems = items.map(item => ({
        ...item,
        // eslint-disable-next-line no-nested-ternary
        active: inIds.includes(item.id) ? true : outIds.includes(item.id) ? false : item.active,
      }));
      return {
        items: newItems,
      };
    });
  };

  handleToggle = () => {
    this.setState(prevState => {
      const { isCollapsed } = prevState;
      return { isCollapsed: !isCollapsed };
    });
  };

  handleClick = () => {
    this.setState({
      isCollapsed: true,
    });
  };

  render() {
    const { items, isCollapsed } = this.state;
    return (
      <div className={`nav ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="nav-toggle" onClick={this.handleToggle} role="button" tabIndex="0">
          <span className="nav-toggle-icon" />
        </div>
        <div className="nav-items">
          <ul>
            {items.map(({ id, name, href, active }) => (
              <li key={id}>
                <a href={href} className={active ? 'active' : undefined} onClick={this.handleClick}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Menu;
