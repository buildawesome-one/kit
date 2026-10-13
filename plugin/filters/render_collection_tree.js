class Tree {
  constructor (rootNode) {
    this.rootNode = rootNode
  }
}

// Removed parents simply becuse they make a circular dependency, and we never need to read upwards.
class TreeNode {
  constructor ({
    value,
    // parent,
    children,
  }) {
    this.value = value
    // this.parent = parent || null
    this.children = children || []
  }
}


function buildTree (collection) {
  const tree = new Tree(new TreeNode({
    value: "/",
    // parent: null
  }))

  collection.sort((a, b) => {
    return a.inputPath.localeCompare(b.inputPath)
  }).forEach((obj) => {
    // This looks weird, but we don't use filePathStem because its missing the extension, and the basename doesn't care about directory structure. using path.ext() i wasn't sure if itd split multiple extensions.
    let fileName = path.basename(obj.inputPath)
    let dir = path.dirname(obj.filePathStem)

    const directories = [path.basename(dir)]

    // Weird i know, but its to handle the edge case of "/" as the root.
    let basename = ""

    while (true) {
      basename = path.basename(dir)

      if (!basename) { break }

      directories.push(basename)
      dir = path.dirname(dir)
    }

    let currentNode = tree.rootNode

    // Reverse so we preserve directory ordering.
    directories.reverse().forEach((dir, index) => {
      if (index === directories.length - 1) {
        currentNode.children.push(new TreeNode({
          value: {
            text: fileName,
            href: obj.url
          },
          // parent: currentNode
        }))
      } else {
        let node = null
        if (currentNode.value.text === dir) {
          node = currentNode
        } else {
          node = currentNode.children.find((node) => {
            return node.value.text === dir
          })
        }

        if (!node) {
          node = new TreeNode({
            value: {
              text: dir
              // TODO: if you have actual directories that can be links, add an "href" here, but you will need to construct it? :shrug:
            }
          })
          currentNode.children.push(node)
        }

        currentNode = node
      }
    })
  })
  return tree
}

function visitValueForList (value) {
  if (Array.isArray(value)) {
    return `<ol>${value.map((val) => {
      return `<li>${visitValueForList(val)}</li>`
    }).join("\n")}</ol>`
  } else {
    if (value.href) {
      return `<a href="${value.href}">${value.text}</a>`
    } else {
      return `${value.text}`
    }
  }
}

function collectValues (node, ary) {
  ary.push(node.value)

  if (node.children.length > 0) {
    const nestedArray = []
    node.children.forEach((node) => collectValues(node, nestedArray))
    ary.push(nestedArray)
  }
}

/**
 * Pass in your own "visitor" callback if you plan to need more than simple <ol><li> wrapping.
 * @example
 *  {{ collections.all | renderTreeAsOrderedList | safe }}
 */
export default function renderTreeAsOrderedList (collection, visitor = visitValueForList) {
  const tree = buildTree(collection)

  let ary = []

  tree.rootNode.children.forEach((node) => {
    collectValues(node, ary)
  })

  return visitor(ary)
}


