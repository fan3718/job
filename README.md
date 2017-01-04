# 云测练
yunzuoye web applications

# 本地打包及部署流程

## Linux/Mac环境

---

先决条件

1. 安装[maven] (https://maven.apache.org/download.cgi)
2. 安装[MySQL] (http://dev.mysql.com/downloads/)
3. 安装[docker] (https://www.docker.com/)
4. 安装[memcached] (https://memcached.org/)
5. 安装[apache-tomcat] (http://tomcat.apache.org/)
6. [注册内网docker账号] (https://docker-auth.zuoyetong.com.cn/)
7. 联系管理员添加内网docker权限
8. 登录docker

    ```bash
       $docker login docker.zuoyetong.com.cn
       $Username: xxxxxxxx
       $Password: xxxxxxxx
       $Login Succeeded
    ```

9. 如果本地部署
    * 运行`build/build-war.sh`打包
    * 把打包好的war文件重命名为ROOT.war, 复制到tomcat的webapps目录下部署
10. 如果远程部署
    * 联系管理员开通相应服务器权限
    * 根据部署环境, 运行`deploy-test.sh`, `deploy-inner-release.sh`或`deploy.sh`打包上传
    * 登录到相应服务器, 定位到对应tomcat的webapps/ROOT/目录, 执行`server-deploy.sh`
    * 重启tomcat

## Windows环境

---

### 方案一

1. 安装VirtualBox, 在VirtualBox里安装Ubuntu虚拟机
2. 在虚拟机里操作同`Linux/Mac环境`

### 方案二

1. 安装[maven] (https://maven.apache.org/download.cgi)
2. 打开项目根目录下的pom.xml文件, 找到这一行:
```xml        
        <testFailureIgnore>false</testFailureIgnore>
```        
改为:
```xml        
        <testFailureIgnore>true</testFailureIgnore>
```        
   - **<font color="red">注意, 此修改不可提交</font>**
   - **<font color="red">注意, 此修改不可提交</font>**
   - **<font color="red">注意, 此修改不可提交</font>**
 

3. 执行
        
        测试包:mvn -Ptest clean compile install
        
        预发布包:mvn -Pinner clean compile install
        
        正式包：mvn -Prelease clean compile install
        
4. 找到打包好的war文件, 用于本地部署, 或手动上传至服务器相应的tomcat进行远程部署

##JS打包流程

1.安装[nodejs] (https://nodejs.org/en/)

2.进入js源码目录

    ```bash
    cd ${projectDir}/com.techyou.eclass.web/src/test/webapp/yuncelian-pc/angular-app
    ```bash        

3.执行(初始化依赖)

    ```bash
    npm install
    ```bash

4.执行打包命令

    ```bash
    npm run dist
    ```bash

输出到 ${projectDir}/com.techyou.eclass.web/src/main/webapp/static目录
