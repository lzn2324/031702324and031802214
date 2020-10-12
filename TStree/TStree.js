    var jobs = new Map;
    var next_node = new Map;
    var students = ["博士生", "硕士生", "本科生"];
    var tree_data;
    var parents = new Map;
    var names = [];
    var sname = [];
    function Build_Tree()
    {
        /*清空全局变量*/
        next_node.clear;
        jobs.clear;
        names.clear;
        parents.clear;
        var text_str = document.getElementById('inputs').value;//得到输入框的值
        if(text_str == ""){
            alert("输入信息不能为空！");
        }
        /*将输入数据按导师分成块*/
        block_str = text_str.split('\n\n\n');//分开两份信息
        for(var i = 0;i < block_str.length;i++)
        {
            line_str = block_str[i].split('\n');//数据按行分开
            var item = line_str[0].split('：');//将每行数据的职位和姓名分开
            if(item[0] != "导师"){
                alert("导师行错误！");
            }
            var teacher = item[1];
            next_node[teacher] = [];//子节点
            jobs[teacher] = item[0];
            names.push(teacher);//保留导师的姓名以便使用
            Manage_Text(line_str,teacher);//处理学生数据
            Creat_Tree();
        }
    }
    function Creat_Tree(){
        Get_Root();
        var  myChart = echarts.init(document.getElementById("container"))
            myChart.setOption(option = {
                tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
                },
                series: [
                    {
                    type: 'tree',
                    data: [tree_data],
                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',
                    symbolSize: 7,
                    label: {
                        normal: {
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 9
                        }
                    },
                    leaves: {
                        label: {
                            normal: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        }
                    },
                    initialTreeDepth: 10,
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                    }
                    ]
            });
    }
    function Manage_Text(line_str,teacher)
    {
        /*处理学生信息*/
        for(var i = 1;i < line_str.length;i++)
        {
            if (line_str[i] === '') continue;
            if(!isNaN(line_str[i].slice(0, 4))){
                for(var val of students)
                {
                    /*按学生学历分别处理*/
                    if(line_str[i].indexOf(val) != -1)
                    {
                        var item = line_str[i].split('：');//将学生学历与姓名分开
                        var stu_str = item[0]+teacher;
                        next_node[teacher].push(stu_str);//将导师与学生学历节点连接
                        jobs[stu_str] = val;
                        next_node[stu_str] = [];
                        parents[stu_str] = 1;
                        names.push(stu_str);//保留学生学历以便使用
                        break;
                    }
                }
                /*处理学生姓名*/
                var stu_names = item[1].split('、');//将同行学生分开处理
                for(var val of stu_names)
                {
                    next_node[stu_str].push(val);//将学生学历与学生姓名节点连接
                    parents[val] = 1;//标记学生有导师
                    jobs[val] = item[0];
                    next_node[val] = [];
                    names.push(val);//保留学生姓名以便使用
                    sname.push(val);
                }
            }
            else
            {
                /*处理技能*/
                for(var val1 of sname)
                {
                    if(item1[0].indexOf(val1) != -1)
                    {
                        var item1 = line_str[i].split(':');//姓名与技能分开
                        var skill_str = item1[0]+val1;
                        next_node[val1].push(skill_str);
                        jobs[skill_str] = val1;
                        next_node[skill_str] = [];
                        parents[skill_str] = 1;
                        name.push(skill_str); 
                    }
                    var skills = item1[1].split('、');
                    for(var val2 of skills){
                        next_node[skill_str].push(val);//技能与学生姓名连接
                        parents[val] = 1;//标记有父节点
                        jobs[val] = item1[0];
                        name.push(val);
                    }
                }
            }
        }
    }
    function Get_Root()
    {
        for(var val of names)
                if(parents[val] == null){//无导师即为本颗树的根节点
                    tree_data=dfs(val,-1);
                }
    }
    function dfs(now,fa)
    {
        /*最终所需数据的格式*/
        var formal_obj = {};
        formal_obj.name=now;
        formal_obj.children=[];
        /*获取子节点数组*/
        var next = next_node[now];
        if(next == null)
            return formal_obj;//搜索到叶节点返回
        for(var i = 0;i < next.length;i++)
            formal_obj.children.push(dfs(next[i],now));//将子节点加入子女对象数组，并进行深搜，递归建树
        if(now.indexOf(fa) != -1)
        {
            var t = now.substring(0, now.indexOf(fa));
            formal_obj.name = t;
        }
        return formal_obj;
    }