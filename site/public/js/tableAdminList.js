document.addEventListener('DOMContentLoaded', function () {
  const initDataTable = (selector, options) => {
    if (!window.jQuery || !$.fn.DataTable) return;

    const $table = $(selector);
    if (!$table.length) return;

    if ($.fn.dataTable.isDataTable($table)) {
      $table.DataTable().destroy();
    }

    $table.DataTable(options);
  };

  const commonLanguage = {
    sProcessing: "Procesando...",
    sLengthMenu: "Mostrar _MENU_ registros",
    sZeroRecords: "No se encontraron resultados",
    sEmptyTable: "Ningún dato disponible en esta tabla",
    sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
    sInfoPostFix: "",
    sSearch: "Buscar:",
    sUrl: "",
    sInfoThousands: ",",
    sLoadingRecords: "Cargando...",
    oPaginate: {
      sFirst: "Primero",
      sLast: "Último",
      sNext: "Siguiente",
      sPrevious: "Anterior"
    },
    oAria: {
      sSortAscending: ": Activar para ordenar la columna de manera ascendente",
      sSortDescending: ": Activar para ordenar la columna de manera descendente"
    }
  };

  initDataTable('#table-orders', {
    pagingType: 'simple',
    pageLength: 10,
    lengthChange: false,
    destroy: true,
    columnDefs: [{ orderable: false, targets: [6, 7] }],
    language: commonLanguage
  });

  initDataTable('#table-products', {
    pagingType: 'simple',
    pageLength: 10,
    lengthChange: false,
    destroy: true,
    columnDefs: [{ orderable: false, targets: [7, 8, 9] }],
    language: commonLanguage
  });

  initDataTable('#table-users', {
    pagingType: 'simple',
    pageLength: 10,
    lengthChange: false,
    destroy: true,
    columnDefs: [{ orderable: false, targets: [4] }],
    language: commonLanguage
  });
});
