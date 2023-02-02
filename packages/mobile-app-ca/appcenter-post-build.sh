if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then

    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "android" ];
     then
        curl -X POST -H "Content-Type: application/json" \
        -d '{"msg_type":"text","content":{"text":"DID:ANDROID端最新包 （id:'$APPCENTER_BUILD_ID'） build成功, 可在appcenter中下载最新包进行测试  https://install.appcenter.ms/orgs/aelf-web/apps/DID-Android"}}' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi


    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios" ];
     then
        curl -X POST -H "Content-Type: application/json" \
        -d '{"msg_type":"text","content":{"text":"DID:IOS端最新包（id:'$APPCENTER_BUILD_ID'） build成功, 可在appcenter中下载最新包进行测试 https://install.appcenter.ms/orgs/aelf-web/apps/DID-IOS"}}' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

     # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios-testFlight" ];
     then
        curl -X POST -H "Content-Type: application/json" \
        -d '{"msg_type":"text","content":{"text":"DID:IOS端最新包（id:'$APPCENTER_BUILD_ID'） 已build成功并推送到testFlight，可以在testFlight查看最新版本的应用' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

fi