# To run it as an individual file using the coffee compiler do:
# coffee src/main/javascript/test_bench/coffeescriptScratchpad.coffee
_ = require 'underscore'
console.log 'Put whatever you want to test with coffescript in this file'
console.log 'To run it just issue coffee \<path\>/coffeescriptScratchpad.coffee'


match_rule = {
  "operator": "and",
  "terms": [
    {
      "key": "src-ip",
      "operator": "in",
      "type": "node",
      "value": [
        "90.104.148.255",
        "103.107.210.196"
      ]
    },
    {
      "key": "dst-ip",
      "operator": "in",
      "type": "node",
      "value": [
        "167.200.152.70",
        "99.165.87.89"
      ]
    },
    {
      "key": "action",
      "operator": "in",
      "type": "node",
      "value": [
        "notified"
      ]
    }
  ],
  "type": "parent"
}

match_rule2 = {
  "operator": "or",
  "type": "parent",
  "terms": [
    match_rule,
    {
      "key": "src-ip",
      "operator": "in",
      "type": "node",
      "value": [
        "A",
        "B"
      ]
    },
    {
      "key": "dst-ip",
      "operator": "in",
      "type": "node",
      "value": [
        "C",
        "D"
      ]
    },
    {
      "key": "action",
      "operator": "in",
      "type": "node",
      "value": [
        "notified"
      ]
    }
  ]
}

rule_tree1 = {
  "operator": "or",
  "type": "parent",
  "terms": [
    {
      "operator": "equals",
      "type": "node",
      "key": "domain",
      "value": "foobar.com"
    },
    {
      "operator": "equals",
      "type": "node",
      "key": "md5",
      "value": "baabd9b76bff84ed27fd432cfc6df241"
    }
  ]
}

tree_node_expression = (node) ->
# determine comparison type here
  value = if _.isArray node.value then "['#{node.value.join "','"}']" else "'#{node.value}'"
  return "comparator_fn(context[\'#{node.key}\'], \'#{node.operator}\', #{value})"

parse_logic_view_tree = (node) ->
  operator =
    and: '&&'
    or: '||'
#  parsed_term = '';
  unless _.isEmpty node then parsed_term = '' else return 'false'
  for term, i in node.terms
    if term.type is 'parent'
      parsed_term += parse_logic_view_tree term
    else
      parsed_term += tree_node_expression term

    if i < node.terms.length - 1
      parsed_term += " #{operator[node.operator]} "
  parsed_term = "(#{parsed_term})"

#console.log 'match_rule1:\n', match_rule
#console.log 'match_rule2:\n', match_rule2
#
#console.log 'parsed_rule1:\n', parse_logic_view_tree match_rule
#console.log 'parsed_rule2:\n', parse_logic_view_tree match_rule2


console.log 'rule_tree1\n', rule_tree1
console.log 'parsed rule_tree1\n', parse_logic_view_tree rule_tree1


console.log "Done!"
