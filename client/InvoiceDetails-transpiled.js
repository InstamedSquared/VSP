function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import DataTable from '../../../components/common/DataTable';
import { icons } from '../../../config/icons';
import Icon from '../../../components/common/Icon';
import Modal from '../../../components/common/Modal';
import { FormInput, FormSelect } from '../../../components/common/FormFields';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var InvoiceDetails = function InvoiceDetails() {
  var _useParams = useParams(),
    id = _useParams.id;
  var navigate = useNavigate();
  var dataTableRef = useRef(null);
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    invoice = _useState2[0],
    setInvoice = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    employees = _useState6[0],
    setEmployees = _useState6[1];

  // Modal state for line items
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isModalOpen = _useState8[0],
    setIsModalOpen = _useState8[1];
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    isEditMode = _useState0[0],
    setIsEditMode = _useState0[1];
  var _useState1 = useState(null),
    _useState10 = _slicedToArray(_useState1, 2),
    selectedItemId = _useState10[0],
    setSelectedItemId = _useState10[1];
  var _useState11 = useState({
      description: '',
      id_employee: '',
      hours: '',
      rate: '',
      amount: ''
    }),
    _useState12 = _slicedToArray(_useState11, 2),
    values = _useState12[0],
    setValues = _useState12[1];
  useEffect(function () {
    var isMounted = true;
    api.get('/api/v1/workforce/employees?limit=1000').then(function (res) {
      if (isMounted && res.data.data) {
        setEmployees(res.data.data.map(function (e) {
          return {
            value: e.id,
            label: "".concat(e.fn, " ").concat(e.sn)
          };
        }));
      }
    })["catch"](function (err) {
      return console.error(err);
    });
    return function () {
      isMounted = false;
    };
  }, []);
  var fetchInvoiceData = /*#__PURE__*/function () {
    var _fetchInvoiceData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var invRes, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            setLoading(true);
            _context.p = 1;
            _context.n = 2;
            return api.get("/api/v1/finance/invoices/".concat(id));
          case 2:
            invRes = _context.v;
            setInvoice(invRes.data.data);
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            console.error('Error fetching invoice details:', _t);
            alert('Failed to load invoice details.');
          case 4:
            _context.p = 4;
            setLoading(false);
            return _context.f(4);
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[1, 3, 4, 5]]);
    }));
    function fetchInvoiceData() {
      return _fetchInvoiceData.apply(this, arguments);
    }
    return fetchInvoiceData;
  }();
  useEffect(function () {
    fetchInvoiceData();
  }, [id]);
  var lineItemApiService = {
    getAll: function getAll(params) {
      return api.get("/api/v1/finance/invoices/".concat(id, "/line-items"), {
        params: params
      });
    },
    remove: function remove(itemId) {
      return api.patch("/api/v1/finance/invoices/".concat(id, "/line-items/").concat(itemId, "/delete"));
    }
  };
  var handleAdd = function handleAdd() {
    setValues({
      description: '',
      id_employee: '',
      hours: '',
      rate: '',
      amount: ''
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };
  var handleEdit = function handleEdit(item) {
    setValues({
      description: item.description || '',
      id_employee: item.id_employee || '',
      hours: item.hours || '',
      rate: item.rate || '',
      amount: item.amount || ''
    });
    setSelectedItemId(item.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  var handleDelete = /*#__PURE__*/function () {
    var _handleDelete = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(itemId) {
      var _dataTableRef$current, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            if (window.confirm('Are you sure you want to delete this line item?')) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            _context2.n = 2;
            return lineItemApiService.remove(itemId);
          case 2:
            fetchInvoiceData(); // Refresh parent invoice totals
            (_dataTableRef$current = dataTableRef.current) === null || _dataTableRef$current === void 0 || _dataTableRef$current.refreshData();
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            alert('Failed to delete line item');
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }));
    function handleDelete(_x) {
      return _handleDelete.apply(this, arguments);
    }
    return handleDelete;
  }();
  var handleChange = function handleChange(e) {
    var _e$target = e.target,
      name = _e$target.name,
      value = _e$target.value;
    setValues(function (prev) {
      var newValues = _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, name, value));
      // Auto-calculate amount preview
      if ((name === 'hours' || name === 'rate') && newValues.hours && newValues.rate) {
        newValues.amount = (parseFloat(newValues.hours) * parseFloat(newValues.rate)).toFixed(2);
      }
      return newValues;
    });
  };
  var handleSave = /*#__PURE__*/function () {
    var _handleSave = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
      var _dataTableRef$current2, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            e.preventDefault();
            _context3.p = 1;
            if (!isEditMode) {
              _context3.n = 3;
              break;
            }
            _context3.n = 2;
            return api.put("/api/v1/finance/invoices/".concat(id, "/line-items/").concat(selectedItemId), values);
          case 2:
            _context3.n = 4;
            break;
          case 3:
            _context3.n = 4;
            return api.post("/api/v1/finance/invoices/".concat(id, "/line-items"), values);
          case 4:
            setIsModalOpen(false);
            fetchInvoiceData(); // Refresh parent invoice totals
            (_dataTableRef$current2 = dataTableRef.current) === null || _dataTableRef$current2 === void 0 || _dataTableRef$current2.refreshData();
            _context3.n = 6;
            break;
          case 5:
            _context3.p = 5;
            _t3 = _context3.v;
            console.error(_t3);
            alert('Error saving line item');
          case 6:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 5]]);
    }));
    function handleSave(_x2) {
      return _handleSave.apply(this, arguments);
    }
    return handleSave;
  }();
  if (loading && !invoice) return /*#__PURE__*/_jsx("div", {
    className: "admin-pager",
    children: /*#__PURE__*/_jsx("p", {
      children: "Loading Invoice..."
    })
  });
  if (!invoice) return /*#__PURE__*/_jsx("div", {
    className: "admin-pager",
    children: /*#__PURE__*/_jsx("p", {
      children: "Invoice not found."
    })
  });
  var columns = [{
    key: 'description',
    label: 'Description',
    type: 1,
    sortable: false,
    render: function render(item) {
      return item.description || 'N/A';
    }
  }, {
    key: 'employee',
    label: 'Employee',
    type: 1,
    sortable: false,
    render: function render(item) {
      return item.employee_fn ? "".concat(item.employee_fn, " ").concat(item.employee_sn) : '-';
    }
  }, {
    key: 'hours',
    label: 'Hours',
    type: 1,
    sortable: false,
    render: function render(item) {
      return item.hours || '-';
    }
  }, {
    key: 'rate',
    label: 'Rate/Hr',
    type: 1,
    sortable: false,
    render: function render(item) {
      return item.rate ? "$".concat(parseFloat(item.rate).toFixed(2)) : '-';
    }
  }, {
    key: 'amount',
    label: 'Amount',
    type: 1,
    sortable: false,
    render: function render(item) {
      return /*#__PURE__*/_jsxs("span", {
        style: {
          fontWeight: '600'
        },
        children: ["$", parseFloat(item.amount).toFixed(2)]
      });
    }
  }];
  return /*#__PURE__*/_jsxs("div", {
    className: "admin-pager",
    children: [/*#__PURE__*/_jsx("div", {
      className: "admin-pager-head",
      style: {
        marginBottom: '20px'
      },
      children: /*#__PURE__*/_jsx("div", {
        className: "admin-pager-title",
        children: /*#__PURE__*/_jsxs("span", {
          children: [/*#__PURE__*/_jsxs("button", {
            type: "button",
            className: "button",
            onClick: function onClick() {
              return navigate('/admin/finance/invoices');
            },
            style: {
              padding: '0',
              marginBottom: '8px',
              border: 'none',
              background: 'none'
            },
            children: [/*#__PURE__*/_jsx(Icon, {
              icon: icons.arrowLeft
            }), " ", /*#__PURE__*/_jsx("p", {
              children: "Back to Invoices"
            })]
          }), /*#__PURE__*/_jsxs("h2", {
            children: ["Invoice ", invoice.invoice_number]
          }), /*#__PURE__*/_jsxs("p", {
            children: ["Client: ", invoice.client_fn, " ", invoice.client_sn]
          })]
        })
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "card",
      style: {
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        gap: '40px',
        backgroundColor: 'var(--bg-card)'
      },
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          flex: 1
        },
        children: [/*#__PURE__*/_jsx("h3", {
          style: {
            marginBottom: '15px',
            color: 'var(--primary-color)'
          },
          children: "Invoice Details"
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            fontSize: '0.95em'
          },
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("strong", {
              children: "Period:"
            }), " ", new Date(invoice.period_start).toLocaleDateString(), " - ", new Date(invoice.period_end).toLocaleDateString()]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("strong", {
              children: "Due Date:"
            }), " ", invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A']
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("strong", {
              children: "Status:"
            }), " ", /*#__PURE__*/_jsx("span", {
              className: "td-badge ".concat(invoice.status === 'paid' ? 'success' : invoice.status === 'sent' ? 'info' : 'alt'),
              style: {
                marginLeft: '8px'
              },
              children: invoice.status
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          width: '300px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '20px',
          borderRadius: '8px'
        },
        children: [/*#__PURE__*/_jsx("h3", {
          style: {
            marginBottom: '15px'
          },
          children: "Summary"
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          },
          children: [/*#__PURE__*/_jsx("span", {
            children: "Subtotal:"
          }), /*#__PURE__*/_jsxs("span", {
            children: ["$", parseFloat(invoice.subtotal).toFixed(2)]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            color: 'var(--text-muted)'
          },
          children: [/*#__PURE__*/_jsx("span", {
            children: "Tax (7.65%):"
          }), /*#__PURE__*/_jsxs("span", {
            children: ["$", parseFloat(invoice.tax).toFixed(2)]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '1.2em',
            fontWeight: 'bold',
            color: 'var(--success-color)'
          },
          children: [/*#__PURE__*/_jsx("span", {
            children: "Total:"
          }), /*#__PURE__*/_jsxs("span", {
            children: ["$", parseFloat(invoice.total).toFixed(2)]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "card",
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)'
        },
        children: [/*#__PURE__*/_jsx("h3", {
          style: {
            margin: 0
          },
          children: "Line Items"
        }), /*#__PURE__*/_jsxs("button", {
          type: "button",
          className: "button",
          onClick: handleAdd,
          children: [/*#__PURE__*/_jsx(Icon, {
            icon: icons.plus
          }), " Add Line Item"]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "table-wrap",
        children: /*#__PURE__*/_jsx(DataTable, {
          ref: dataTableRef,
          resourceName: "lineItems",
          apiService: lineItemApiService,
          columns: columns,
          config: {
            edit: false,
            "delete": false,
            rowActions: [{
              icon: icons.edit,
              text: 'Edit',
              onClick: function onClick(item) {
                return handleEdit(item);
              }
            }, {
              icon: icons["delete"],
              text: 'Delete',
              className: 'danger',
              onClick: function onClick(item) {
                return handleDelete(item.id);
              }
            }]
          }
        })
      })]
    }), /*#__PURE__*/_jsx(Modal, {
      isOpen: isModalOpen,
      onClose: function onClose() {
        return setIsModalOpen(false);
      },
      title: isEditMode ? 'Edit Line Item' : 'Add Line Item',
      actions: [{
        text: 'Cancel',
        className: 'btn-secondary',
        icon: icons.times,
        onClick: function onClick() {
          return setIsModalOpen(false);
        }
      }, {
        text: isEditMode ? 'Save Changes' : 'Add Line Item',
        className: 'btn-primary',
        icon: icons.save,
        onClick: function onClick() {
          var form = document.getElementById('lineitem-form');
          if (form) form.requestSubmit();
        }
      }],
      children: /*#__PURE__*/_jsxs("form", {
        id: "lineitem-form",
        className: "form-case",
        onSubmit: handleSave,
        children: [/*#__PURE__*/_jsx("div", {
          className: "form-row",
          children: /*#__PURE__*/_jsx(FormInput, {
            label: "Description",
            name: "description",
            value: values.description,
            onChange: handleChange,
            placeholder: "e.g., Development hours",
            required: true,
            className: "w100"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "form-row",
          children: /*#__PURE__*/_jsx(FormSelect, {
            label: "Employee (Optional)",
            name: "id_employee",
            value: values.id_employee,
            onChange: handleChange,
            options: employees,
            className: "w100"
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "form-row",
          children: [/*#__PURE__*/_jsx(FormInput, {
            type: "number",
            step: "0.01",
            label: "Hours",
            name: "hours",
            value: values.hours,
            onChange: handleChange,
            className: "w5"
          }), /*#__PURE__*/_jsx(FormInput, {
            type: "number",
            step: "0.01",
            label: "Rate ($)",
            name: "rate",
            value: values.rate,
            onChange: handleChange,
            className: "w5"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "form-row",
          children: /*#__PURE__*/_jsx(FormInput, {
            type: "number",
            step: "0.01",
            label: "Total Amount ($)",
            name: "amount",
            value: values.amount,
            onChange: handleChange,
            required: true,
            className: "w100"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "form-dvr"
        })]
      })
    })]
  });
};
export default InvoiceDetails;