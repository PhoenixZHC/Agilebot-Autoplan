// 页面加载时初始化菜单栏
document.addEventListener('DOMContentLoaded', function () {
    // 默认显示机器人设置
    showSection('robot-settings-content');
    document.getElementById('robot-settings-btn').classList.add('active');
});

// 菜单栏按钮点击事件
document.getElementById('robot-settings-btn').addEventListener('click', function () {
    showSection('robot-settings-content');
    setActiveButton('robot-settings-btn');
});

document.getElementById('smart-planning-btn').addEventListener('click', function () {
    showSection('smart-planning-content');
    setActiveButton('smart-planning-btn');
});

document.getElementById('data-list-btn').addEventListener('click', function () {
    showSection('data-list-content');
    setActiveButton('data-list-btn');
});

// 显示对应的内容区域
function showSection(sectionId) {
    // 隐藏所有内容区域
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // 显示选中的内容区域
    document.getElementById(sectionId).style.display = 'block';
}

// 设置当前选中的菜单按钮
function setActiveButton(buttonId) {
    // 移除所有按钮的 active 类
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.classList.remove('active');
    });

    // 为选中的按钮添加 active 类
    document.getElementById(buttonId).classList.add('active');
}

// 动态显示或隐藏底边长输入框
document.getElementById('triangle_type').addEventListener('change', function () {
    const triangleType = this.value;
    const baseLengthInput = document.getElementById('triangle_base_length_input');

    if (triangleType === 'isosceles') {
        baseLengthInput.style.display = 'block'; // 显示底边长输入框
    } else {
        baseLengthInput.style.display = 'none'; // 隐藏底边长输入框
    }
});

// 页面加载时初始化底边长输入框的显示状态
document.addEventListener('DOMContentLoaded', function () {
    const triangleType = document.getElementById('triangle_type').value;
    const baseLengthInput = document.getElementById('triangle_base_length_input');

    if (triangleType === 'isosceles') {
        baseLengthInput.style.display = 'block'; // 显示底边长输入框
    } else {
        baseLengthInput.style.display = 'none'; // 隐藏底边长输入框
    }
});

// 页面加载时初始化输入框显示状态
document.addEventListener('DOMContentLoaded', function () {
    const shapeType = document.getElementById('shape_type').value;
    updateInputFields(shapeType);
});

// 动态显示图形输入框
document.getElementById('shape_type').addEventListener('change', function () {
    const shapeType = this.value;
    updateInputFields(shapeType);
});

function updateInputFields(shapeType) {
    // 隐藏所有图形输入框
    document.querySelectorAll('.shape-input').forEach(div => div.style.display = 'none');

    // 根据选择的图形类型显示对应的输入框
    if (shapeType === 'circle') {
        document.getElementById('circle_input').style.display = 'block';
    } else if (shapeType === 'rectangle') {
        document.getElementById('rectangle_input').style.display = 'block';
    } else if (shapeType === 'polygon') {
        document.getElementById('polygon_input').style.display = 'block';
    } else if (shapeType === 'triangle') {
        document.getElementById('triangle_input').style.display = 'block';
    }
}
let shapeCenters = [];  // 全局变量，用于存储图形的中心位置

// 获取表单数据并发送请求
document.getElementById('inputForm2').addEventListener('submit', function (event) {
    event.preventDefault();

    // 获取参数设置表单的数据
    const frame_length = document.getElementById('frame_length').value;
    const frame_width = document.getElementById('frame_width').value;
    const frame_depth = document.getElementById('frame_depth').value;
    const shape_type = document.getElementById('shape_type').value;
    const shape_height = document.getElementById('shape_height').value;

    let shape_length, shape_width, polygon_sides, triangle_type, triangle_orientation;

    if (shape_type === 'circle') {
        shape_length = document.getElementById('circle_diameter').value;
        shape_width = shape_length;
    } else if (shape_type === 'rectangle') {
        shape_length = document.getElementById('rectangle_length').value;
        shape_width = document.getElementById('rectangle_width').value;
    } else if (shape_type === 'polygon') {
        polygon_sides = document.getElementById('polygon_sides').value;
        shape_length = document.getElementById('polygon_side_length').value;
        shape_width = shape_length;
    } else if (shape_type === 'triangle') {
        triangle_type = document.getElementById('triangle_type').value;
        shape_length = document.getElementById('triangle_side_length').value;
        triangle_orientation = document.getElementById('triangle_orientation').value;

        // 如果是等腰三角形，传递底边长；否则传递边长作为底边长
        if (triangle_type === 'isosceles') {
            shape_width = document.getElementById('triangle_base_length').value;
        } else {
            shape_width = shape_length; // 等边三角形的底边长等于边长
        }
    }

    // 获取摆放设置表单的数据
    const horizontal_spacing = document.getElementById('horizontal_spacing').value;
    const vertical_spacing = document.getElementById('vertical_spacing').value;
    const horizontal_border_distance = document.getElementById('horizontal_border_distance').value;
    const vertical_border_distance = document.getElementById('vertical_border_distance').value;
    const material_thickness = document.getElementById('material_thickness').value;
    const placement_layers = document.getElementById('placement_layers').value;
    const layout_type = document.getElementById('layout_type').value;
    const place_type = document.getElementById('place_type').value;

    // 发送请求到后端
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            frame_length,
            frame_width,
            frame_depth,
            shape_length,
            shape_width,
            horizontal_spacing,
            vertical_spacing,
            horizontal_border_distance,
            vertical_border_distance,
            material_thickness,
            placement_layers,
            shape_type,
            layout_type,
            polygon_sides,
            triangle_type,
            triangle_orientation,
            shape_height,
            place_type
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '请求失败');
            });
        }
        // 获取填充的图形数量和中心位置数据
        const totalShapes = response.headers.get('X-Total-Shapes');
        const shapeCentersData = response.headers.get('X-Shape-Centers');
        shapeCenters = JSON.parse(shapeCentersData);  // 将中心位置数据存储到全局变量中

        // 如果是三角形，将 totalShapes 除以 2
        let finalTotalShapes = totalShapes;
        if (shape_type === 'triangle') {
            finalTotalShapes = Math.floor(totalShapes / 2); // 使用 Math.floor 确保结果为整数
        }

        return Promise.all([response.blob(), finalTotalShapes]);
    })
    .then(([blob, finalTotalShapes]) => {
        const imageUrl = URL.createObjectURL(blob);
        const plotImg = document.getElementById('plot');
        plotImg.src = imageUrl;
        plotImg.style.display = 'block';

        // 显示填充的图形数量
        const shapeCount = document.getElementById('shape-count');
        const shapeCountValue = document.getElementById('shape-count-value');
        shapeCountValue.textContent = finalTotalShapes; // 使用处理后的 finalTotalShapes
        shapeCount.style.display = 'block';

        // 显示写入P点的输入框和按钮
        const writePDataSection = document.getElementById('write-p-data-section');
        writePDataSection.style.display = 'block';

        console.log('图像加载成功');
    })
    .catch(error => {
        console.error('请求失败:', error.message);
        alert('请求失败: ' + error.message);
    });
});

// 在数据清单页面中显示中心位置数据
document.getElementById('data-list-btn').addEventListener('click', function () {
    showSection('data-list-content');
    setActiveButton('data-list-btn');

    // 清空之前的数据
    const dataListContainer = document.querySelector('#data-list-content .data-list-container');
    dataListContainer.innerHTML = '<h2>数据清单</h2>';

    // 创建表格来显示中心位置数据
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';

    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['序号', 'X 坐标', 'Y 坐标'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 创建表格主体
    const tbody = document.createElement('tbody');
    shapeCenters.forEach((center, index) => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        cell1.textContent = index + 1;
        cell1.style.border = '1px solid #ddd';
        cell1.style.padding = '8px';
        row.appendChild(cell1);

        const cell2 = document.createElement('td');
        cell2.textContent = center[0].toFixed(2);  // 显示 X 坐标，保留两位小数
        cell2.style.border = '1px solid #ddd';
        cell2.style.padding = '8px';
        row.appendChild(cell2);

        const cell3 = document.createElement('td');
        cell3.textContent = center[1].toFixed(2);  // 显示 Y 坐标，保留两位小数
        cell3.style.border = '1px solid #ddd';
        cell3.style.padding = '8px';
        row.appendChild(cell3);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // 将表格添加到数据清单容器中
    dataListContainer.appendChild(table);
});

// 绘制图形
function drawShapes(shape_centers, shape_type, frame_length, frame_width) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置画布尺寸与边框尺寸一致
    const scale_factor = 4; // 放大4倍
    canvas.width = frame_length * scale_factor;
    canvas.height = frame_width * scale_factor;

    // 绘制边框
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, frame_length * scale_factor, frame_width * scale_factor);

    shape_centers.forEach(center => {
        const [x, y] = center;
        if (shape_type === 'circle') {
            ctx.beginPath();
            ctx.arc(x * scale_factor, y * scale_factor, 5 * scale_factor / 2, 0, 2 * Math.PI); // 半径为5，放大4倍
            ctx.fillStyle = 'blue';
            ctx.fill();
        } else if (shape_type === 'rectangle') {
            ctx.fillStyle = 'green';
            ctx.fillRect(
                x * scale_factor - 5 * scale_factor / 2,
                y * scale_factor - 5 * scale_factor / 2,
                10 * scale_factor / 2,
                10 * scale_factor / 2
            ); // 10x10 的矩形，放大4倍
        } else if (shape_type === 'polygon') {
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.moveTo(x * scale_factor + 5 * scale_factor / 2, y * scale_factor);
            ctx.lineTo(x * scale_factor + 2.5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor - 2.5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor - 5 * scale_factor / 2, y * scale_factor);
            ctx.lineTo(x * scale_factor - 2.5 * scale_factor / 2, y * scale_factor - 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor + 2.5 * scale_factor / 2, y * scale_factor - 5 * scale_factor / 2);
            ctx.closePath();
            ctx.fill();
        } else if (shape_type === 'triangle') {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(x * scale_factor, y * scale_factor - 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor - 5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor + 5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// 处理机器人连接和断开连接
function fetchWithTimeout(url, options, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('请求超时')), timeout)
        )
    ]);
}

// 在机器人连接成功后显示程序输入框
document.getElementById('robot_connect_button').addEventListener('click', function () {
    const robotIp = document.getElementById('robot_ip').value;
    const connectButton = document.getElementById('robot_connect_button');
    const isConnected = connectButton.textContent === '断开连接';

    if (isConnected) {
        // 如果当前是“断开连接”状态，则发送断开连接请求
        fetchWithTimeout('/disconnect_robot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }, 5000) // 设置超时时间为 5 秒
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || '断开连接失败');
                });
            }
            return response.json();
        })
        .then(data => {
            // 更新按钮状态和显示
            connectButton.textContent = '连接';
            document.getElementById('robot_status').style.display = 'none';
            document.getElementById('program_input').style.display = 'none'; // 隐藏程序输入框
            document.getElementById('p_data_table_container').style.display = 'none'; // 隐藏P点数据表格
            console.log('机器人已断开连接');
        })
        .catch(error => {
            console.error('断开连接失败:', error.message);
            alert('断开连接失败: ' + error.message);
        });
    } else {
        // 如果当前是“连接”状态，则发送连接请求
        if (!robotIp) {
            alert('请输入机器人IP地址');
            return;
        }

        fetchWithTimeout('/connect_robot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                robot_ip: robotIp
            }),
        }, 5000) // 设置超时时间为 5 秒
        .then(response => {
            if (!response.ok) {
                // 连接失败时，重置按钮状态
                connectButton.textContent = '连接';
                return response.json().then(err => {
                    throw new Error(err.error || '连接失败');
                });
            }
            return response.json();
        })
        .then(data => {
            // 更新按钮状态和显示
            connectButton.textContent = '断开连接';
            const robotStatus = document.getElementById('robot_status');
            const robotIpDisplay = document.getElementById('robot_ip_display');
            const robotModel = document.getElementById('robot_model');
            const controllerVersion = document.getElementById('controller_version');

            robotIpDisplay.textContent = robotIp;
            robotModel.textContent = data.model_info;
            controllerVersion.textContent = data.controller_version; // 显示控制柜版本
            robotStatus.style.display = 'block';
            document.getElementById('program_input').style.display = 'block'; // 显示程序输入框

            console.log('机器人连接成功');
        })
        .catch(error => {
            console.error('连接失败:', error.message);
            // 根据错误类型显示不同的提示
            if (error.message === '请求超时') {
                alert('请求超时: 请检查网络连接或稍后重试');
            } else {
                alert('连接失败: ' + error.message);
            }
            // 连接失败时，重置按钮状态
            connectButton.textContent = '连接';
        });
    }
});

// 处理读取P点数据的按钮点击事件
document.getElementById('read_p_data_button').addEventListener('click', function () {
    const programName = document.getElementById('program_name').value || 'PUT';
    // 如果用户没有输入，则使用默认值 'PUT'

    if (!programName) {
        alert('请输入程序名称');
        return;
    }

    // 发送请求到后端获取P点数据
    fetch('/get_p_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            program_name: programName
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '获取P点数据失败');
            });
        }
        return response.json();
    })
    .then(data => {
        // 显示P点数据表格
        const tableContainer = document.getElementById('p_data_table_container');
        const tableBody = document.querySelector('#p_data_table tbody');
        tableBody.innerHTML = ''; // 清空之前的表格数据

        // 填充表格数据
        data.poses.forEach((pose, index) => {
            const row = document.createElement('tr');

            // 序号
            const cell1 = document.createElement('td');
            cell1.textContent = index + 1;
            cell1.style.border = '1px solid #ddd';
            cell1.style.padding = '8px';
            row.appendChild(cell1);

            // X坐标
            const cell2 = document.createElement('td');
            cell2.textContent = pose.poseData.cartData.baseCart.position.x.toFixed(2);
            cell2.style.border = '1px solid #ddd';
            cell2.style.padding = '8px';
            row.appendChild(cell2);

            // Y坐标
            const cell3 = document.createElement('td');
            cell3.textContent = pose.poseData.cartData.baseCart.position.y.toFixed(2);
            cell3.style.border = '1px solid #ddd';
            cell3.style.padding = '8px';
            row.appendChild(cell3);

            // Z坐标
            const cell4 = document.createElement('td');
            cell4.textContent = pose.poseData.cartData.baseCart.position.z.toFixed(2);
            cell4.style.border = '1px solid #ddd';
            cell4.style.padding = '8px';
            row.appendChild(cell4);

            // C坐标
            const cell5 = document.createElement('td');
            cell5.textContent = pose.poseData.cartData.baseCart.position.c.toFixed(2);
            cell5.style.border = '1px solid #ddd';
            cell5.style.padding = '8px';
            row.appendChild(cell5);

            // UF值
            const cell6 = document.createElement('td');
            cell6.textContent = pose.poseData.cartData.uf; // 直接显示UF值
            cell6.style.border = '1px solid #ddd';
            cell6.style.padding = '8px';
            row.appendChild(cell6);

            // TF值
            const cell7 = document.createElement('td');
            cell7.textContent = pose.poseData.cartData.tf; // 直接显示TF值
            cell7.style.border = '1px solid #ddd';
            cell7.style.padding = '8px';
            row.appendChild(cell7);

            // 坐标系方向值
            const cell8 = document.createElement('td');
            const leftRightValue = pose.poseData.cartData.baseCart.posture.arm_left_right;
            cell8.textContent = leftRightValue === 1 ? '右手' : '左手';  // 将1和-1转换为文本描述
            cell8.style.border = '1px solid #ddd';
            cell8.style.padding = '8px';
            row.appendChild(cell8);

            tableBody.appendChild(row);
        });

        // 显示表格
        tableContainer.style.display = 'block';
    })
    .catch(error => {
        console.error('获取P点数据失败:', error.message);
        alert('获取P点数据失败: ' + error.message);
    });
});

// 处理写入P点数据的按钮点击事件
document.getElementById('write_p_data_button').addEventListener('click', function () {
    const programName = document.getElementById('write_program_name').value || 'PUT'; // 如果用户没有输入，则使用默认值 'PUT'
    const prRegisterId = parseInt(document.getElementById('pr_register_id').value, 10); // 将PR寄存器ID转换为整数
    const ufValue = parseInt(document.getElementById('uf_value').value, 10); // 将UF值转换为整数
    const toolCount = parseInt(document.getElementById('tool_count').value, 10); // 获取工具数量
    const left_right = parseInt(document.getElementById('left_right').value, 10); // 获取工具数量

    if (!programName) {
        alert('请输入程序名称');
        return;
    }

    if (isNaN(prRegisterId)) { // 检查PR寄存器ID是否为有效数字
        alert('请输入有效的PR寄存器ID');
        return;
    }

    // 获取之前计算出的图形中心数据
    if (shapeCenters.length === 0) {
        alert('没有可用的图形中心数据');
        return;
    }

    // 发送请求到后端读取PR寄存器的Z和C值
    fetch('/read_pr_register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pr_register_id: prRegisterId // 传递整数类型的PR寄存器ID
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '读取PR寄存器失败');
            });
        }
        return response.json();
    })
    .then(data => {
        const zValue = data.z; // 获取PR寄存器的Z值
        const cValue = data.c; // 获取PR寄存器的C值

        // 准备要写入的P点数据
        const pData = shapeCenters.map((center, index) => ({
            id: index + 1, // 序号
            x: center[0],  // X坐标
            y: center[1],  // Y坐标
            z: zValue,     // 使用PR寄存器的Z值
            c: cValue,     // 使用PR寄存器的C值
            uf: ufValue,   // 添加UF值
            tf: (index % toolCount) + 1,// 根据工具数量循环设置TF值
            left_right: left_right   // 左手/右手坐标系
        }));

        // 发送请求到后端写入P点数据
        return fetch('/write_p_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                program_name: programName,
                p_data: pData
            }),
        });
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '写入P点数据失败');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('P点数据写入成功');
        alert('P点数据写入成功');
    })
    .catch(error => {
        console.error('写入P点数据失败:', error.message);
        alert('写入P点数据失败: ' + error.message);
    });
});

// 在“写入P点”按钮点击事件中，新增R逻辑
document.getElementById('write_p_data_button').addEventListener('click', function () {
    // 获取新增输入框的值
    const frame_length = document.getElementById('frame_length').value;
    const frame_width = document.getElementById('frame_width').value;
    const frameDepth = document.getElementById('frame_depth').value;
    const shapeHeight = document.getElementById('shape_height').value;
    const materialThickness = document.getElementById('material_thickness').value;
    const placementLayers = document.getElementById('placement_layers').value;
    const shapeCountValue = document.getElementById('shape-count-value').textContent;
    const toolCount = document.getElementById('tool_count').value;
    const drop_Count = document.getElementById('drop_Count').value;

    // 检查填充数量和工具数量是否有效
    if (!shapeCountValue || !toolCount) {
        alert('请先进行计算并确保工具数量已选择');
        return;
    }

    // 发送请求到后端写入R寄存器
    fetch('/write_r_registers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            frame_length: frame_length,
            frame_width: frame_width,
            frame_depth: frameDepth,
            shape_height: shapeHeight,
            material_thickness: materialThickness,
            placement_layers: placementLayers,
            total_shapes: shapeCountValue, // 填充数量
            tool_count: toolCount,         // 工具数量
            drop_Count: drop_Count
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '写入R寄存器失败');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('R寄存器写入成功');
        alert('R寄存器写入成功');
    })
    .catch(error => {
        console.error('写入R寄存器失败:', error.message);
        alert('写入R寄存器失败: ' + error.message);
    });
});

// 在“写入P点”按钮点击事件中，新增tf逻辑
document.getElementById('write_p_data_button').addEventListener('click', function () {
    const toolCount = parseInt(document.getElementById('tool_count').value, 10); // 获取工具数量
    const toolSpacing = parseFloat(document.getElementById('tool_spacing').value); // 获取工具间距
    const autoTF = parseInt(document.getElementById('autoTF').value, 10); // 获取自动TF功能开关状态

    if (isNaN(toolSpacing)) { // 检查工具间距是否为有效数字
        alert('请输入有效的工具间距');
        return;
    }

    // 如果工具数量为 1，直接返回，不需要修改 TF
    if (toolCount === 1) {
        return;
    }

    // 如果自动TF功能关闭，直接返回，不调整TF
    if (autoTF === 0) {
        return;
    }

    // 发送请求到后端读取TF1的值
    fetch('/get_tf_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tf_id: 1 // 读取TF1的值
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '读取TF1数据失败');
            });
        }
        return response.json();
    })
.then(data => {
    const tf1 = data.tf; // 获取TF1的值

    // 复制TF1的值给其他TF，并根据工具间距调整Y值
    const tfUpdates = [];
    for (let i = 2; i <= toolCount; i++) {
        const newTf = {
            coordinate_info: {
                coordinate_id: i, // 设置新的TF ID
                name: tf1.coordinate_info.name, // 复制TF1的名称
                group_id: tf1.coordinate_info.group_id // 复制TF1的组ID
            },
            position: {
                x: tf1.position.x, // 复制TF1的X值
                y: tf1.position.y + (i - 1) * toolSpacing, // 调整Y值
                z: tf1.position.z // 复制TF1的Z值
            },
            orientation: {
                r: tf1.orientation.r, // 复制TF1的A值
                p: tf1.orientation.p, // 复制TF1的B值
                y: tf1.orientation.y // 复制TF1的C值
            }
        };
        tfUpdates.push(newTf);
    }

    // 调试输出，检查 tfUpdates 的内容
    console.log('tfUpdates:', tfUpdates);

    // 发送请求到后端更新TF
    return fetch('/update_tf_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tf_updates: tfUpdates
        }),
    });
})
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '更新TF数据失败');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('TF数据更新成功');
        alert('TF数据更新成功');
    })
    .catch(error => {
        console.error('更新TF数据失败:', error.message);
        alert('更新TF数据失败: ' + error.message);
    });
});