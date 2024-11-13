  
src="https://cdn.jsdelivr.net/npm/chart.js"


var l = 12
const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');


new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [l, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
document.getElementById('myChart').remove();

const myChart3 = new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [l, 3, 7, 5, 6, 10],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function addData(label, newData) {
  let chart = myChart3
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(newData);
  });
  chart.update();
}

// function removeData(chart) {
//   let chart = myChart3
//   chart.data.labels.pop();
//   chart.data.datasets.forEach((dataset) => {
//       dataset.data.pop();
//   });
//   chart.update();
// }