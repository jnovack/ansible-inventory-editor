import { ipcRenderer } from 'electron';

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('yaml-data', (event, data) => {
        console.log(data);
        if (data && data.all) {
            populateHosts(data.all.hosts || {});
            populateGroups(data.all.children || {});
        }
    });
});

function populateHosts(hosts) {
    const hostsList = document.getElementById('hostsList');
    hostsList.innerHTML = '';
    Object.keys(hosts).forEach(host => {
        const li = document.createElement('li');
        li.textContent = host;
        li.draggable = true;
        li.classList.add('list-group-item', 'draggable');
        hostsList.appendChild(li);
    });
}

function populateGroups(groups) {
    const groupsList = document.getElementById('groupsList');
    groupsList.innerHTML = '';
    Object.keys(groups).forEach(group => {
        const li = document.createElement('li');
        li.textContent = group;
        li.classList.add('list-group-item', 'expandable');
        li.addEventListener('click', () => toggleGroup(li, groups[group]));
        groupsList.appendChild(li);
    });
}

function toggleGroup(li, subgroup) {
    if (li.dataset.expanded === 'true') {
        li.dataset.expanded = 'false';
        li.querySelectorAll('ul').forEach(ul => ul.remove());
    } else {
        li.dataset.expanded = 'true';
        const sublist = document.createElement('ul');
        sublist.classList.add('list-group', 'ms-3');
        Object.keys(subgroup.children || {}).forEach(sub => {
            const subLi = document.createElement('li');
            subLi.textContent = sub;
            subLi.classList.add('list-group-item');
            sublist.appendChild(subLi);
        });
        li.appendChild(sublist);
    }
}
