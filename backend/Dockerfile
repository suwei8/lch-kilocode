FROM node:22-alpine
WORKDIR /usr/src/app

# 仅拷贝依赖清单，充分利用缓存
COPY package*.json ./

# 可复现安装；遇到 peer 冲突使用 --legacy-peer-deps
RUN npm install --legacy-peer-deps

# 再拷贝源码
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]