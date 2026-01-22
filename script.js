// ================= AVL NODE =================
class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

let root = null;
let insertCount = 0;

// ================= AVL HELPERS =================
function height(n) {
  return n ? n.height : 0;
}

function getBalance(n) {
  return n ? height(n.left) - height(n.right) : 0;
}

// ================= ROTATIONS =================
function rightRotate(y) {
  let x = y.left;
  let t2 = x.right;

  x.right = y;
  y.left = t2;

  y.height = Math.max(height(y.left), height(y.right)) + 1;
  x.height = Math.max(height(x.left), height(x.right)) + 1;

  return x;
}

function leftRotate(x) {
  let y = x.right;
  let t2 = y.left;

  y.left = x;
  x.right = t2;

  x.height = Math.max(height(x.left), height(x.right)) + 1;
  y.height = Math.max(height(y.left), height(y.right)) + 1;

  return y;
}

// ================= INSERT =================
function insertAVL(node, key) {
  if (!node) return new Node(key);

  if (key < node.val)
    node.left = insertAVL(node.left, key);
  else
    node.right = insertAVL(node.right, key);

  node.height = 1 + Math.max(height(node.left), height(node.right));

  let balance = getBalance(node);

  // LL
  if (balance > 1 && key < node.left.val)
    return rightRotate(node);

  // RR
  if (balance < -1 && key > node.right.val)
    return leftRotate(node);

  // LR
  if (balance > 1 && key > node.left.val) {
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }

  // RL
  if (balance < -1 && key < node.right.val) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }

  return node;
}

// ================= DRAW TREE =================
function renderTree() {
  const container = document.getElementById("tree");
  container.innerHTML = "";

  if (!root) return;

  const width = container.offsetWidth;
  const levelGap = 90;

  function draw(node, x, y, gap) {
    if (!node) return;

    const div = document.createElement("div");
    div.className = "node";
    div.innerText = node.val;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    container.appendChild(div);

    if (node.left) {
      drawLine(x + 25, y + 50, x - gap + 25, y + levelGap);
      draw(node.left, x - gap, y + levelGap, gap / 2);
    }

    if (node.right) {
      drawLine(x + 25, y + 50, x + gap + 25, y + levelGap);
      draw(node.right, x + gap, y + levelGap, gap / 2);
    }
  }

  draw(root, width / 2 - 25, 20, width / 4);
}

// ================= DRAW LINE =================
function drawLine(x1, y1, x2, y2) {
  const line = document.createElement("div");
  line.className = "line";

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  line.style.width = `${length}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.transform = `rotate(${angle}deg)`;

  document.getElementById("tree").appendChild(line);
}

// ================= BUTTON HANDLER =================
function insert() {
  const input = document.getElementById("value");
  const val = parseInt(input.value);
  if (isNaN(val)) return;

  root = insertAVL(root, val);
  renderTree();

  insertCount++;
  logHistory(val);

  input.value = "";
}

// Allow Enter key to insert
document.getElementById("value").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    insert();
  }
});
function logHistory(val) {
  const history = document.getElementById("history");
  const li = document.createElement("li");
  li.textContent = `${insertCount} → ${val}`;
  history.appendChild(li);
}

