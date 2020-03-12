
import * as CDP from 'chrome-remote-interface'


export const clearDNSCache = async()=> {
    let client;
    try {
        // connect to endpoint
        client = await (CDP as any)();
        // extract domains
        const {Network, Page} = client;
        // setup handlers
        Network.requestWillBeSent((params: any) => {
            console.log(params.request.url);
        });
        // enable events then start!
        await Network.enable();
        await Page.enable();
        await Page.navigate({url: 'https://github.com'});
        await Page.loadEventFired();
        // const { Runtime} = client
        // Runtime.enable();
        // Runtime.evaluate({ expression: "chrome.benchmarking.clearHostResolverCache();" })
        // Runtime.evaluate({ expression: "chrome.benchmarking.clearCache();" })
        // Runtime.evaluate({ expression: "chrome.benchmarking.closeConnections();" })
        //     console.log('DNS Cache Clear');

    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            await client.close();
        }
    }

}
