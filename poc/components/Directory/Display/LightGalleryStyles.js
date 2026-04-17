export const styles = `
.lg-object img {
  min-height: 400px;
  object-fit: cover;
 }
 

.lg-outer .lg-thumb-item.active,
.lg-outer .lg-thumb-item:hover {
  border-color: #fff;
}
.lg-outer .lg-thumb-item {
  border-color: #a3a3a3;
}
.lg-outer .lg-thumb-item.active .lg-thumb-item-inner {
  border-color: #fff;
}
.lg-outer .lg-thumb-item .lg-thumb-item-inner {
  border-color: #a3a3a3;
}


.lg-container.lg-show.lg-show-in.lg-inline .lg-backdrop {
  background-color: #fff;
}
.lg-container.lg-show.lg-show-in.lg-inline .lg-toolbar .lg-icon:hover {
  color: #555;
}

.lg-container.lg-show.lg-show-in.lg-inline .lg-outer .lg-toolbar .lg-counter {
  position: absolute;
  left: 10px;
  top: 10px;
  display: none;
}

.lg-container.lg-show.lg-show-in.lg-inline .lg-prev,
.lg-container.lg-show.lg-show-in.lg-inline .lg-next {
  background-color: #848484;
}

.lg-container.lg-show.lg-show-in.lg-inline .lg-toolbar.lg-group {
  margin-top: 47px;
}

.lg-container.lg-show.lg-show-in.lg-inline .lg-toolbar .lg-icon,
.lg-container.lg-show.lg-show-in.lg-inline .lg-next,
.lg-container.lg-show.lg-show-in.lg-inline .lg-prev {
  color: #fff;
  background: #848484;
  margin-left: 10px;
  border-radius: 50%;
}

.lg-container.lg-show.lg-show-in.lg-inline .lg-toolbar .lg-icon:hover,
.lg-container.lg-show.lg-show-in.lg-inline .lg-next:hover,
.lg-container.lg-show.lg-show-in.lg-inline .lg-prev:hover {
  color: #fff;
  background: #555;
}

.lg-container.lg-show.lg-show-in.lg-inline .lg-toolbar,
.lg-container.lg-show.lg-show-in.lg-inline .lg-prev,
.lg-container.lg-show.lg-show-in.lg-inline .lg-next,
.lg-container.lg-show.lg-show-in.lg-inline .lg-pager-outer {
  color: white;
}


.lg-container.lg-show.lg-show-in.lg-inline .lg-sub-html {
  color: #555;
}`;

export const smallImageStyles = `
  .lg-image {
    object-fit: cover; 
  }
  .lg-thumb-item {
    min-width: 80px; 
    min-height: 80px; 
  }
`;
